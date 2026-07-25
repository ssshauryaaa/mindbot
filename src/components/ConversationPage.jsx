import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  Plus, Bookmark, Compass, LayoutGrid, BarChart2,
  MoreHorizontal, Mic, Settings2, MessageSquare,
  ChevronDown, Lightbulb, Clapperboard, TrendingUp,
  HelpCircle, Sparkles, Brain, Cpu, User, ArrowLeft,
  Copy, Check, LayoutDashboard, Paperclip, RefreshCw,
  Share2, ThumbsUp, ThumbsDown, Code,
} from 'lucide-react';
import { FloatingDock } from './ui/floating-dock';
import AITextLoading from './ui/ai-text-loading';
import FloatingActionButton from './ui/floating-action-button';

/* ════════════════════════════════════════════════════════════════
   1. BACKGROUND — Vertical beam + ambient glow + particles
════════════════════════════════════════════════════════════════ */
function BeamBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none select-none">
      {/* ── Video background ──────────────────────────────── */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
        style={{ opacity: 0.55 }}
      >
        <source src="/aurora-1784998368911.webm" type="video/webm" />
      </video>
      {/* Dark tint — exact match with landing page */}
      <div className="absolute inset-0" style={{ background: 'rgba(0,0,0,0.45)' }} />

      {/* ── Flowing diagonal abstract wave lines (bottom-left to upper-right) ── */}
      {/* These match the dark streaks visible across the screenshot background  */}
      <svg
        className="absolute inset-0 w-full h-full"
        viewBox="0 0 1440 900"
        preserveAspectRatio="xMidYMid slice"
        fill="none"
      >
        {/* Main sweeping curves — lower-left origin, arc to upper-right */}
        <path d="M -60 780 Q 340 500 680 300 Q 860 200 1100 80"
          stroke="rgba(255,255,255,0.055)" strokeWidth="1.4" strokeLinecap="round"/>
        <path d="M -80 850 Q 300 560 660 340 Q 850 225 1120 95"
          stroke="rgba(255,255,255,0.035)" strokeWidth="1.0" strokeLinecap="round"/>
        <path d="M 0 900 Q 380 620 700 400 Q 900 275 1160 120"
          stroke="rgba(255,255,255,0.025)" strokeWidth="0.8" strokeLinecap="round"/>

        {/* Tighter inner arcs */}
        <path d="M 50 820 Q 380 560 680 360 Q 870 255 1080 110"
          stroke="rgba(255,255,255,0.03)" strokeWidth="0.7" strokeLinecap="round"/>
        <path d="M -20 730 Q 300 470 640 275 Q 830 175 1050 55"
          stroke="rgba(255,255,255,0.045)" strokeWidth="1.1" strokeLinecap="round"/>

        {/* Lower subtle ground-plane arcs */}
        <path d="M -100 950 Q 400 680 800 500 Q 980 415 1200 300"
          stroke="rgba(255,255,255,0.018)" strokeWidth="0.9" strokeLinecap="round"/>
        <path d="M 100 900 Q 480 700 820 540 Q 1000 460 1300 370"
          stroke="rgba(255,255,255,0.022)" strokeWidth="0.7" strokeLinecap="round"/>

        {/* Far right edge decorative strokes */}
        <path d="M 1440 900 C 1360 780 1320 660 1380 520 C 1410 455 1440 420 1420 340"
          stroke="rgba(255,255,255,0.06)" strokeWidth="1.2" strokeLinecap="round"/>
        <path d="M 1440 860 C 1350 730 1300 600 1370 470 C 1405 405 1440 375 1415 295"
          stroke="rgba(255,255,255,0.035)" strokeWidth="0.8" strokeLinecap="round"/>
        <path d="M 1440 820 C 1340 700 1290 560 1360 440"
          stroke="rgba(255,255,255,0.025)" strokeWidth="0.6" strokeLinecap="round" strokeDasharray="4 8"/>
      </svg>


      {/* ── Star-dust particles ──────────────────────────── */}
      {[
        { x:'61%', y:'12%', s:1.8, o:0.65 },
        { x:'72%', y:'26%', s:1.1, o:0.40 },
        { x:'66%', y:'47%', s:1.3, o:0.28 },
        { x:'80%', y:'18%', s:1.0, o:0.38 },
        { x:'30%', y:'20%', s:1.0, o:0.30 },
        { x:'22%', y:'43%', s:1.5, o:0.22 },
        { x:'76%', y:'58%', s:1.0, o:0.18 },
        { x:'45%', y:'7%',  s:1.2, o:0.50 },
        { x:'38%', y:'32%', s:1.0, o:0.20 },
        { x:'88%', y:'36%', s:1.4, o:0.25 },
        { x:'15%', y:'60%', s:1.0, o:0.15 },
      ].map((p, i) => (
        <div key={i} className="absolute rounded-full bg-white"
          style={{ left:p.x, top:p.y, width:p.s, height:p.s, opacity:p.o }}/>
      ))}
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════
   2. LOGO MARK — Glowing triangular synapse shape
════════════════════════════════════════════════════════════════ */
function LogoMark({ size = 48 }) {
  return (
    <div className="relative flex items-center justify-center" style={{ width: size * 1.8, height: size * 1.8 }}>
      {/* Outer glow ring */}
      <div className="absolute rounded-full" style={{
        width: size * 1.8, height: size * 1.8,
        background: 'radial-gradient(circle, rgba(180,160,255,0.15) 0%, transparent 65%)',
        filter: 'blur(14px)',
      }}/>
      {/* Inner pulse ring */}
      <div className="absolute rounded-full animate-pulse" style={{
        width: size, height: size,
        background: 'radial-gradient(circle, rgba(255,255,255,0.2) 0%, transparent 65%)',
        filter: 'blur(6px)',
      }}/>
      {/* SVG mark */}
      <svg width={size} height={size} viewBox="0 0 52 52" fill="none"
        className="relative z-10 animate-logo-glow">
        {/* Left arm */}
        <line x1="26" y1="9" x2="9"  y2="36" stroke="white" strokeWidth="2.8" strokeLinecap="round"/>
        {/* Right arm */}
        <line x1="26" y1="9" x2="43" y2="36" stroke="white" strokeWidth="2.8" strokeLinecap="round"/>
        {/* Diagonal inner notch — makes it look like the Behance play-arrow mark */}
        <line x1="17" y1="28" x2="32" y2="20" stroke="white" strokeWidth="2.8" strokeLinecap="round"/>
      </svg>
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════
   3. SIDEBAR — Icon-only (60 px) with tooltips
════════════════════════════════════════════════════════════════ */
function Sidebar({ activePage, onNavigate }) {
  const navigate = useNavigate();

  const dockItems = [
    {
      title: 'New Session',
      icon: <Plus className="h-full w-full" />,
      onClick: () => onNavigate('new')
    },
    {
      title: 'History',
      icon: <Bookmark className="h-full w-full" />,
      onClick: () => {}
    },
    {
      title: 'Landing Page',
      icon: <Compass className="h-full w-full" />,
      onClick: () => navigate('/landing')
    },
    {
      title: 'All Tools',
      icon: <LayoutGrid className="h-full w-full" />,
      onClick: () => {}
    },
    {
      title: 'More',
      icon: <MoreHorizontal className="h-full w-full" />,
      onClick: () => {}
    }
  ];

  return (
    <div className="fixed left-4 top-1/2 -translate-y-1/2 z-50">
      <FloatingDock items={dockItems} orientation="vertical" />
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════
   4. SHARED INPUT BOX
════════════════════════════════════════════════════════════════ */
const PLACEHOLDER_TEXTS = [
  "What do you want to know?",
  "Ask me anything...",
  "Describe a problem to solve...",
  "Let's explore an idea together...",
  "What's on your mind today?",
  "Need help with something?",
];

function useTypewriter(texts, { typeSpeed = 55, deleteSpeed = 30, pauseMs = 1800 } = {}) {
  const [displayed, setDisplayed] = useState('');
  const [textIndex, setTextIndex] = useState(0);
  const [phase, setPhase] = useState('typing'); // 'typing' | 'pausing' | 'deleting'

  useEffect(() => {
    const current = texts[textIndex];
    let timeout;

    if (phase === 'typing') {
      if (displayed.length < current.length) {
        timeout = setTimeout(() => setDisplayed(current.slice(0, displayed.length + 1)), typeSpeed);
      } else {
        timeout = setTimeout(() => setPhase('pausing'), pauseMs);
      }
    } else if (phase === 'pausing') {
      setPhase('deleting');
    } else if (phase === 'deleting') {
      if (displayed.length > 0) {
        timeout = setTimeout(() => setDisplayed(displayed.slice(0, -1)), deleteSpeed);
      } else {
        setTextIndex((i) => (i + 1) % texts.length);
        setPhase('typing');
      }
    }

    return () => clearTimeout(timeout);
  }, [displayed, phase, textIndex, texts, typeSpeed, deleteSpeed, pauseMs]);

  return displayed;
}

function InputBox({ value, onChange, onSend, activeMode, onModeChange, large = false }) {
  const textareaRef = useRef(null);
  const placeholder = useTypewriter(PLACEHOLDER_TEXTS);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 180) + 'px';
    }
  }, [value]);

  const canSend = value.trim().length > 0;

  return (
    <div className="glass-input rounded-2xl w-full relative" style={{ borderRadius: 18 }}>
      {/* Animated typewriter placeholder — only shown when input is empty */}
      {!value && (
        <div
          aria-hidden="true"
          className="absolute pointer-events-none select-none text-[15px] text-white/30 leading-relaxed"
          style={{
            top: large ? 20 : 14,
            left: 20,
            fontFamily: 'Inter, sans-serif',
          }}
        >
          {placeholder}
          {/* Blinking cursor */}
          <span
            className="inline-block w-px h-[1em] bg-white/30 ml-px align-middle"
            style={{ animation: 'blink 1s step-end infinite' }}
          />
        </div>
      )}

      {/* Text area — native placeholder hidden; we use the overlay above */}
      <textarea
        ref={textareaRef}
        value={value}
        onChange={e => onChange(e.target.value)}
        onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); onSend(); } }}
        placeholder=""
        rows={large ? 3 : 1}
        className="w-full bg-transparent resize-none px-5 pt-4 pb-1 text-[15px] text-white/90 focus:outline-none leading-relaxed"
        style={{ fontFamily: 'Inter, sans-serif', minHeight: large ? 72 : 44 }}
      />


      {/* Bottom control row */}
      <div className="flex items-center justify-between px-4 pb-3.5 pt-1 gap-2">
        {/* Left: Mode pill */}
        <button onClick={() => onModeChange(activeMode === 'Auto' ? 'Focused' : 'Auto')}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs text-white/70 hover:text-white transition-colors cursor-pointer"
          style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.12)' }}>
          <Sparkles className="w-3.5 h-3.5 text-white/70" strokeWidth={1.5}/>
          <span>{activeMode}</span>
          <ChevronDown className="w-3 h-3 text-white/50"/>
        </button>

        {/* Right: action icons with FloatingActionButton */}
        <div className="flex items-center gap-2">
          <FloatingActionButton
            size="sm"
            label="Quick Tools"
            positionClassName="relative"
            actions={[
              {
                id: "attach",
                label: "Attach File",
                icon: <Paperclip className="w-4 h-4 text-white" />,
                onClick: () => onChange(value + " [Attachment] "),
              },
              {
                id: "code",
                label: "Insert Code",
                icon: <Code className="w-4 h-4 text-white" />,
                onClick: () => onChange(value + "\n```js\n// Code here\n```\n"),
              },
              {
                id: "voice",
                label: "Voice Dictation",
                icon: <Mic className="w-4 h-4 text-white" />,
                onClick: () => onSend("Voice dictation input"),
              },
              {
                id: "settings",
                label: "Model Parameters",
                icon: <Settings2 className="w-4 h-4 text-white" />,
                onClick: () => onModeChange(activeMode === "Auto" ? "Focused" : "Auto"),
              },
            ]}
          />

          {/* Send */}
          <button onClick={onSend} disabled={!canSend} aria-label="Send"
            className="w-8 h-8 rounded-lg flex items-center justify-center transition-all cursor-pointer"
            style={{
              background: canSend ? '#ffffff' : 'rgba(255,255,255,0.05)',
              border: canSend ? '1px solid #ffffff' : '1px solid rgba(255,255,255,0.08)',
              boxShadow: canSend ? '0 0 12px rgba(255,255,255,0.25)' : 'none',
              opacity: canSend ? 1 : 0.4,
            }}>
            <MessageSquare className={`w-4 h-4 ${canSend ? 'text-black' : 'text-white/30'}`} strokeWidth={1.5}/>
          </button>
        </div>
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════
   5. SUGGESTION CHIPS
════════════════════════════════════════════════════════════════ */
const SUGGESTIONS = [
  { label: 'Generate ideas',  icon: Lightbulb },
  { label: 'Motion concept',  icon: Clapperboard },
  { label: 'Market analysis', icon: TrendingUp },
  { label: 'Ask AI anything', icon: HelpCircle },
];

function SuggestionChips({ onSelect, compact = false }) {
  return (
    <div className={`flex flex-wrap items-center justify-center gap-2.5 ${compact ? 'justify-start' : ''}`}>
      {SUGGESTIONS.map(({ label, icon: Icon }) => (
        <button key={label} onClick={() => onSelect(label)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm text-white/65 hover:text-white transition-all duration-200 cursor-pointer"
          style={{
            background: 'rgba(255,255,255,0.045)',
            border: '1px solid rgba(255,255,255,0.09)',
            backdropFilter: 'blur(10px)',
          }}
          onMouseEnter={e => { e.currentTarget.style.background='rgba(255,255,255,0.08)'; e.currentTarget.style.borderColor='rgba(255,255,255,0.18)'; }}
          onMouseLeave={e => { e.currentTarget.style.background='rgba(255,255,255,0.045)'; e.currentTarget.style.borderColor='rgba(255,255,255,0.09)'; }}>
          <Icon className="w-4 h-4 text-white/45" strokeWidth={1.5}/>
          <span>{label}</span>
        </button>
      ))}
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════
   6. MESSAGE BUBBLE
════════════════════════════════════════════════════════════════ */
function MessageBubble({ msg }) {
  const [copied, setCopied] = useState(false);
  const [liked, setLiked] = useState(null); // null | 'up' | 'down'

  const copyText = () => {
    navigator.clipboard.writeText(msg.text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (msg.sender === 'user') {
    return (
      <motion.div initial={{ opacity:0, y:10 }} animate={{ opacity:1, y:0 }}
        className="flex justify-end items-end gap-3">
        <div
          className="max-w-lg px-5 py-3.5 rounded-2xl rounded-br-sm text-sm text-white/90 leading-relaxed"
          style={{
            background: 'rgba(255,255,255,0.06)',
            border: '1px solid rgba(255,255,255,0.10)',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
          }}
        >
          {msg.text}
          <div className="text-[10px] font-mono text-white/25 text-right mt-1.5">{msg.time}</div>
        </div>
        <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0"
          style={{ background:'rgba(255,255,255,0.08)', border:'1px solid rgba(255,255,255,0.14)', backdropFilter:'blur(12px)' }}>
          <User className="w-4 h-4 text-white/70"/>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div initial={{ opacity:0, y:10 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.05 }}
      className="flex justify-start items-start gap-3">
      {/* Avatar */}
      <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-0.5"
        style={{ background:'rgba(255,255,255,0.07)', border:'1px solid rgba(255,255,255,0.13)', backdropFilter:'blur(12px)' }}>
        <Sparkles className="w-3.5 h-3.5 text-white/60"/>
      </div>

      {/* Bubble */}
      <div className="max-w-2xl space-y-3 min-w-0">
        <div
          className="px-5 py-4 rounded-2xl rounded-tl-sm text-sm text-white/88 leading-relaxed"
          style={{
            background: 'rgba(255,255,255,0.05)',
            border: '1px solid rgba(255,255,255,0.09)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
          }}
        >
          <p>{msg.text}</p>

          {/* Dual-stream insight cards */}
          {(msg.aiReasoning || msg.humanInsight) && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mt-4">
              {msg.aiReasoning && (
                <div className="p-3 rounded-xl text-xs"
                  style={{ background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.08)' }}>
                  <div className="flex items-center gap-1.5 mb-1.5 font-mono font-semibold text-white/50">
                    <Cpu className="w-3 h-3"/><span>AI Compute Stream</span>
                  </div>
                  <p className="text-white/55 leading-snug">{msg.aiReasoning}</p>
                </div>
              )}
              {msg.humanInsight && (
                <div className="p-3 rounded-xl text-xs"
                  style={{ background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.08)' }}>
                  <div className="flex items-center gap-1.5 mb-1.5 font-mono font-semibold text-white/50">
                    <Brain className="w-3 h-3"/><span>Human Context</span>
                  </div>
                  <p className="text-white/55 leading-snug">{msg.humanInsight}</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Action row */}
        <div className="flex items-center gap-2 pl-1">
          <span className="text-[10px] font-mono text-white/20">{msg.time} · Verified</span>
          <div className="flex items-center gap-1.5 ml-2">
            <button onClick={copyText} title="Copy response"
              className="flex items-center gap-1 text-[11px] text-white/25 hover:text-white/60 transition-colors cursor-pointer">
              {copied ? <Check className="w-3.5 h-3.5 text-white/60"/> : <Copy className="w-3.5 h-3.5"/>}
            </button>
            <button onClick={() => setLiked('up')} title="Good response"
              className={`text-[11px] hover:text-white/60 transition-colors cursor-pointer ${liked==='up' ? 'text-white/80' : 'text-white/25'}`}>
              <ThumbsUp className="w-3.5 h-3.5"/>
            </button>
            <button onClick={() => setLiked('down')} title="Bad response"
              className={`text-[11px] hover:text-white/60 transition-colors cursor-pointer ${liked==='down' ? 'text-white/80' : 'text-white/25'}`}>
              <ThumbsDown className="w-3.5 h-3.5"/>
            </button>
            <button title="Regenerate" className="text-white/25 hover:text-white/60 transition-colors cursor-pointer">
              <RefreshCw className="w-3.5 h-3.5"/>
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

/* ════════════════════════════════════════════════════════════════
   7. TYPING INDICATOR
════════════════════════════════════════════════════════════════ */
function TypingIndicator() {
  return (
    <motion.div initial={{ opacity:0, y:8 }} animate={{ opacity:1, y:0 }}
      className="flex items-start gap-3">
      <div className="w-8 h-8 mt-0.5 rounded-full flex items-center justify-center shrink-0"
        style={{ background:'rgba(255,255,255,0.07)', border:'1px solid rgba(255,255,255,0.13)', backdropFilter:'blur(12px)' }}>
        <Sparkles className="w-3.5 h-3.5 text-white/60"/>
      </div>
      <div className="flex items-center px-5 py-3.5 rounded-2xl rounded-tl-sm"
        style={{ background:'rgba(255,255,255,0.05)', border:'1px solid rgba(255,255,255,0.09)', backdropFilter:'blur(20px)' }}>
        <AITextLoading className="text-sm tracking-wide font-normal" interval={1500} texts={[
          "Synthesizing dual response...",
          "Analyzing contexts...",
          "Verifying alignment...",
          "Processing thoughts...",
          "Almost ready..."
        ]} />
      </div>
    </motion.div>
  );
}

/* ════════════════════════════════════════════════════════════════
   8. CONVERSATION PAGE — main export
════════════════════════════════════════════════════════════════ */
export default function ConversationPage() {
  const navigate    = useNavigate();
  const chatEndRef  = useRef(null);
  const [messages,  setMessages]  = useState([]);
  const [inputVal,  setInputVal]  = useState('');
  const [isTyping,  setIsTyping]  = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const [activeMode, setActiveMode] = useState('Auto');
  const [sessionTitle, setSessionTitle] = useState('New conversation');

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const sendMessage = text => {
    const t = (text || inputVal).trim();
    if (!t) return;
    setInputVal('');
    setHasStarted(true);
    if (messages.length === 0) setSessionTitle(t.slice(0, 48));

    setMessages(prev => [...prev, {
      id: Date.now(), sender: 'user', text: t,
      time: new Date().toLocaleTimeString([], { hour:'2-digit', minute:'2-digit' }),
    }]);
    setIsTyping(true);

    setTimeout(() => {
      setIsTyping(false);
      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        sender: 'synaptica',
        text: `Here's the synthesized analysis for: "${t.length > 60 ? t.slice(0, 60) + '…' : t}"`,
        aiReasoning: 'Fast pattern engine: Matched across 1.4M domain vectors in 18ms. Optimal reasoning path verified with zero hallucination checksum.',
        humanInsight: 'Contextual guardrail: Aligned with real-world human judgment, practical usability, and ethical constraints before generating this response.',
        time: new Date().toLocaleTimeString([], { hour:'2-digit', minute:'2-digit' }),
      }]);
    }, 1800);
  };

  const resetSession = () => {
    setMessages([]);
    setHasStarted(false);
    setSessionTitle('New conversation');
  };

  return (
    <div className="relative flex h-screen w-screen overflow-hidden bg-black">
      <BeamBackground />

      {/* ── Floating Sidebar (fixed overlay, no backing bar) ─── */}
      <Sidebar activePage="chat" onNavigate={action => { if (action === 'new') resetSession(); }} />

      {/* ── Main area — full width now ───────────────────────── */}
      <main className="relative z-10 flex-1 flex flex-col overflow-hidden">

        {/* ════════════════════════════════════════════════════ */}
        {/*  WELCOME SCREEN (no messages yet)                   */}
        {/* ════════════════════════════════════════════════════ */}
        <AnimatePresence mode="wait">
          {!hasStarted && (
            <motion.div key="welcome"
              initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0, y:-16 }}
              transition={{ duration:0.35 }}
              className="flex-1 flex flex-col items-center justify-center px-6 pb-12">

              {/* Glowing Logo Mark */}
              <motion.div
                initial={{ opacity:0, scale:0.75 }} animate={{ opacity:1, scale:1 }}
                transition={{ delay:0.05, duration:0.55, ease:[0.16,1,0.3,1] }}
                className="mb-7">
                <LogoMark size={48}/>
              </motion.div>

              {/* Heading */}
              <motion.h1
                initial={{ opacity:0, y:14 }} animate={{ opacity:1, y:0 }}
                transition={{ delay:0.15, duration:0.5 }}
                className="text-4xl sm:text-5xl font-light text-white text-center mb-10"
                style={{ letterSpacing:'-0.03em', lineHeight:1.1 }}>
                What can I help you<br/><span style={{ opacity: 0.45 }}>explore today?</span>
              </motion.h1>

              {/* Input */}
              <motion.div
                initial={{ opacity:0, y:18 }} animate={{ opacity:1, y:0 }}
                transition={{ delay:0.22, duration:0.5 }}
                className="w-full max-w-2xl mb-7">
                <InputBox
                  value={inputVal} onChange={setInputVal}
                  onSend={sendMessage} large
                  activeMode={activeMode} onModeChange={setActiveMode}
                />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ════════════════════════════════════════════════════ */}
        {/*  ACTIVE CONVERSATION                                 */}
        {/* ════════════════════════════════════════════════════ */}
        <AnimatePresence>
          {hasStarted && (
            <motion.div key="chat"
              initial={{ opacity:0 }} animate={{ opacity:1 }}
              className="flex-1 flex flex-col overflow-hidden">


              {/* Scrollable message thread — with bottom padding so thread scrolls cleanly above floating input */}
              <div className="flex-1 overflow-y-auto px-5 sm:px-10 lg:px-20 pt-8 pb-36 space-y-6">
                {messages.map(msg => <MessageBubble key={msg.id} msg={msg}/>)}
                {isTyping && <TypingIndicator/>}
                <div ref={chatEndRef}/>
              </div>

              {/* Floating bottom input box — centered max-w-2xl container */}
              <div className="absolute bottom-0 left-0 right-0 flex flex-col items-center px-4 pb-6 pt-2 pointer-events-none z-20">
                <div className="w-full max-w-2xl pointer-events-auto">
                  <InputBox
                    value={inputVal} onChange={setInputVal}
                    onSend={sendMessage}
                    activeMode={activeMode} onModeChange={setActiveMode}
                  />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>


      </main>
    </div>
  );
}
