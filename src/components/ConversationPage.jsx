import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  Plus, Bookmark, Compass, LayoutGrid, BarChart2,
  MoreHorizontal, Mic, Settings2, MessageSquare,
  ChevronDown, Lightbulb, Clapperboard, TrendingUp,
  HelpCircle, Sparkles, Brain, Cpu, User, ArrowLeft,
  Copy, Check, LayoutDashboard, Paperclip, RefreshCw,
  Share2, ThumbsUp, ThumbsDown,
} from 'lucide-react';

/* ════════════════════════════════════════════════════════════════
   1. BACKGROUND — Vertical beam + ambient glow + particles
════════════════════════════════════════════════════════════════ */
function BeamBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none select-none">
      {/* ── Pure black base ──────────────────────────────── */}
      <div className="absolute inset-0" style={{ background: '#020203' }} />

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

      {/* ── Vertical light beam — crisp center column ──── */}
      <div
        className="absolute left-1/2 top-0 -translate-x-1/2 animate-beam-pulse"
        style={{
          width: 1.5,
          height: '58%',
          background: 'linear-gradient(to bottom, rgba(255,255,255,0.0) 0%, rgba(255,255,255,1.0) 30%, rgba(220,210,255,0.8) 60%, rgba(255,255,255,0.0) 100%)',
        }}
      />

      {/* Bright core glow right at the beam top */}
      <div
        className="absolute left-1/2 top-0 -translate-x-1/2"
        style={{
          width: 120,
          height: '28%',
          background: 'radial-gradient(ellipse 40% 55% at 50% 0%, rgba(255,255,255,0.22) 0%, rgba(200,190,255,0.08) 55%, transparent 100%)',
          filter: 'blur(18px)',
        }}
      />

      {/* Wide ambient bloom behind beam — fills the middle zone */}
      <div
        className="absolute left-1/2 top-0 -translate-x-1/2"
        style={{
          width: 500,
          height: '55%',
          background: 'radial-gradient(ellipse 42% 52% at 50% 8%, rgba(200,185,255,0.11) 0%, transparent 75%)',
          filter: 'blur(38px)',
        }}
      />

      {/* Mid-page subtle synapse glow — where beam terminates */}
      <div
        className="absolute left-1/2 top-[44%] -translate-x-1/2"
        style={{
          width: 640,
          height: 200,
          background: 'radial-gradient(ellipse 50% 30% at 50% 50%, rgba(124,92,255,0.06) 0%, transparent 70%)',
          filter: 'blur(30px)',
        }}
      />

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

  const items = [
    { icon: Plus,          label: 'New Session',  action: () => onNavigate('new') },
    { icon: Bookmark,      label: 'History',      action: () => {} },
    { icon: Compass,       label: 'Landing Page', action: () => navigate('/landing') },
    { icon: LayoutGrid,    label: 'All Tools',    action: () => {} },
    { icon: LayoutDashboard, label: 'Dashboard',  action: () => navigate('/dashboard') },
    { icon: MoreHorizontal, label: 'More',        action: () => {} },
  ];

  return (
    <aside className="relative z-20 flex flex-col items-center py-4 gap-4 shrink-0"
      style={{
        width: 60,
        background: 'rgba(3,3,4,0.88)',
        backdropFilter: 'blur(28px)',
        WebkitBackdropFilter: 'blur(28px)',
        borderRight: '1px solid rgba(255,255,255,0.05)',
      }}>
      {/* Brand mark top */}
      <div className="mb-2">
        <svg viewBox="0 0 40 40" className="w-6 h-6">
          <line x1="8" y1="20" x2="32" y2="20" stroke="#7c5cff" strokeWidth="2.2" strokeLinecap="round"/>
          <circle cx="8"  cy="20" r="4.5" fill="#00c8ef"/>
          <circle cx="32" cy="20" r="4.5" fill="#a855f7"/>
        </svg>
      </div>

      {/* Nav items */}
      {items.map(({ icon: Icon, label, action }, i) => (
        <button key={i} onClick={action} title={label} aria-label={label}
          className="sidebar-icon-btn group relative">
          <Icon className="w-[18px] h-[18px]" strokeWidth={1.6}/>
          {/* Tooltip */}
          <span className="absolute left-full ml-3 whitespace-nowrap text-[11px] font-medium text-white bg-void-800 border border-void-700 px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50 shadow-lg">
            {label}
          </span>
        </button>
      ))}
    </aside>
  );
}

/* ════════════════════════════════════════════════════════════════
   4. SHARED INPUT BOX
════════════════════════════════════════════════════════════════ */
function InputBox({ value, onChange, onSend, activeMode, onModeChange, large = false }) {
  const textareaRef = useRef(null);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 180) + 'px';
    }
  }, [value]);

  const canSend = value.trim().length > 0;

  return (
    <div className="glass-input rounded-2xl w-full" style={{ borderRadius: 18 }}>
      {/* Text area */}
      <textarea
        ref={textareaRef}
        value={value}
        onChange={e => onChange(e.target.value)}
        onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); onSend(); } }}
        placeholder="What do you want to know ?"
        rows={large ? 3 : 1}
        className="w-full bg-transparent resize-none px-5 pt-4 pb-1 text-[15px] text-white/90 placeholder-white/25 focus:outline-none leading-relaxed"
        style={{ fontFamily: 'Inter, sans-serif', minHeight: large ? 72 : 44 }}
      />

      {/* Bottom control row */}
      <div className="flex items-center justify-between px-4 pb-3.5 pt-1 gap-2">
        {/* Left: Mode pill */}
        <button onClick={() => onModeChange(activeMode === 'Auto' ? 'Focused' : 'Auto')}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs text-white/55 hover:text-white/90 transition-colors cursor-pointer"
          style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.10)' }}>
          <Sparkles className="w-3.5 h-3.5 text-synapse-400" strokeWidth={1.5}/>
          <span>{activeMode}</span>
          <ChevronDown className="w-3 h-3"/>
        </button>

        {/* Right: action icons */}
        <div className="flex items-center gap-1.5">
          {[
            { icon: Paperclip, label: 'Attach file' },
            { icon: Settings2, label: 'Settings' },
            { icon: Mic,       label: 'Voice input' },
          ].map(({ icon: Icon, label }) => (
            <button key={label} aria-label={label}
              className="w-8 h-8 rounded-lg flex items-center justify-center text-white/35 hover:text-white/75 transition-colors cursor-pointer"
              style={{ background: 'rgba(255,255,255,0.05)' }}>
              <Icon className="w-4 h-4" strokeWidth={1.5}/>
            </button>
          ))}

          {/* Send */}
          <button onClick={onSend} disabled={!canSend} aria-label="Send"
            className="w-8 h-8 rounded-lg flex items-center justify-center transition-all cursor-pointer"
            style={{
              background: canSend
                ? 'linear-gradient(135deg, #00c8ef 0%, #7c5cff 55%, #a855f7 100%)'
                : 'rgba(255,255,255,0.07)',
              border: '1px solid rgba(255,255,255,0.12)',
              boxShadow: canSend ? '0 0 14px rgba(124,92,255,0.55)' : 'none',
              opacity: canSend ? 1 : 0.4,
            }}>
            <MessageSquare className="w-4 h-4 text-white" strokeWidth={1.5}/>
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
        className="flex justify-end items-end gap-2.5">
        <div className="max-w-lg px-5 py-3.5 rounded-2xl rounded-br-sm text-sm text-white/90 leading-relaxed"
          style={{ background:'rgba(35,38,62,0.75)', border:'1px solid rgba(255,255,255,0.09)' }}>
          {msg.text}
          <div className="text-[10px] font-mono text-white/30 text-right mt-1.5">{msg.time}</div>
        </div>
        <div className="w-7 h-7 rounded-full flex items-center justify-center shrink-0"
          style={{ background:'linear-gradient(135deg,#a855f7,#7c5cff)', boxShadow:'0 0 12px rgba(168,85,247,0.4)' }}>
          <User className="w-3.5 h-3.5 text-white"/>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div initial={{ opacity:0, y:10 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.08 }}
      className="flex justify-start items-start gap-2.5">
      {/* Avatar */}
      <div className="w-7 h-7 rounded-full flex items-center justify-center shrink-0 mt-1"
        style={{ background:'rgba(124,92,255,0.2)', border:'1px solid rgba(124,92,255,0.4)', boxShadow:'0 0 12px rgba(124,92,255,0.3)' }}>
        <Sparkles className="w-3.5 h-3.5 text-synapse-400"/>
      </div>

      {/* Bubble */}
      <div className="max-w-2xl space-y-3 min-w-0">
        <div className="px-5 py-4 rounded-2xl rounded-tl-sm text-sm text-white/88 leading-relaxed"
          style={{ background:'rgba(14,16,26,0.8)', border:'1px solid rgba(255,255,255,0.08)' }}>
          <p>{msg.text}</p>

          {/* Dual-stream insight cards */}
          {(msg.aiReasoning || msg.humanInsight) && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mt-4">
              {msg.aiReasoning && (
                <div className="p-3 rounded-xl text-xs"
                  style={{ background:'rgba(0,200,239,0.07)', border:'1px solid rgba(0,200,239,0.22)' }}>
                  <div className="flex items-center gap-1.5 mb-1.5 font-mono font-semibold text-ai-400">
                    <Cpu className="w-3 h-3"/><span>AI Compute Stream</span>
                  </div>
                  <p className="text-white/65 leading-snug">{msg.aiReasoning}</p>
                </div>
              )}
              {msg.humanInsight && (
                <div className="p-3 rounded-xl text-xs"
                  style={{ background:'rgba(168,85,247,0.07)', border:'1px solid rgba(168,85,247,0.22)' }}>
                  <div className="flex items-center gap-1.5 mb-1.5 font-mono font-semibold text-human-400">
                    <Brain className="w-3 h-3"/><span>Human Context</span>
                  </div>
                  <p className="text-white/65 leading-snug">{msg.humanInsight}</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Action row */}
        <div className="flex items-center gap-2 pl-1">
          <span className="text-[10px] font-mono text-white/25">{msg.time} · Verified</span>
          <div className="flex items-center gap-1.5 ml-2">
            <button onClick={copyText} title="Copy response"
              className="flex items-center gap-1 text-[11px] text-white/30 hover:text-white/70 transition-colors cursor-pointer">
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400"/> : <Copy className="w-3.5 h-3.5"/>}
            </button>
            <button onClick={() => setLiked('up')} title="Good response"
              className={`text-[11px] hover:text-white/70 transition-colors cursor-pointer ${liked==='up' ? 'text-emerald-400' : 'text-white/30'}`}>
              <ThumbsUp className="w-3.5 h-3.5"/>
            </button>
            <button onClick={() => setLiked('down')} title="Bad response"
              className={`text-[11px] hover:text-white/70 transition-colors cursor-pointer ${liked==='down' ? 'text-rose-400' : 'text-white/30'}`}>
              <ThumbsDown className="w-3.5 h-3.5"/>
            </button>
            <button title="Regenerate" className="text-white/30 hover:text-white/70 transition-colors cursor-pointer">
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
      className="flex items-center gap-2.5">
      <div className="w-7 h-7 rounded-full flex items-center justify-center"
        style={{ background:'rgba(124,92,255,0.2)', border:'1px solid rgba(124,92,255,0.35)' }}>
        <Sparkles className="w-3.5 h-3.5 text-synapse-400"/>
      </div>
      <div className="flex items-center gap-2 px-4 py-3 rounded-xl"
        style={{ background:'rgba(14,16,26,0.75)', border:'1px solid rgba(255,255,255,0.07)' }}>
        <span className="text-xs font-mono text-white/40">Synthesizing dual response</span>
        <div className="flex items-center gap-1 ml-1">
          <span className="w-1.5 h-1.5 rounded-full bg-ai-400 inline-block typing-dot-1"/>
          <span className="w-1.5 h-1.5 rounded-full bg-synapse-400 inline-block typing-dot-2"/>
          <span className="w-1.5 h-1.5 rounded-full bg-human-400 inline-block typing-dot-3"/>
        </div>
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
    <div className="flex h-screen w-screen overflow-hidden" style={{ background:'var(--void-1000)' }}>
      <BeamBackground />

      {/* ── Sidebar ──────────────────────────────────────────── */}
      <Sidebar activePage="chat" onNavigate={action => { if (action === 'new') resetSession(); }} />

      {/* ── Main area ────────────────────────────────────────── */}
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
                className="text-4xl sm:text-5xl font-normal text-white text-center mb-10"
                style={{ letterSpacing:'-0.03em', lineHeight:1.1 }}>
                How can i help&nbsp;<span className="text-gradient-duality">you today?</span>
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

              {/* Suggestion chips */}
              <motion.div
                initial={{ opacity:0, y:14 }} animate={{ opacity:1, y:0 }}
                transition={{ delay:0.32, duration:0.5 }}>
                <SuggestionChips onSelect={sendMessage}/>
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

              {/* Top session bar */}
              <div className="shrink-0 flex items-center justify-between px-5 py-3"
                style={{ borderBottom:'1px solid rgba(255,255,255,0.06)', background:'rgba(8,9,15,0.55)', backdropFilter:'blur(20px)' }}>
                <div className="flex items-center gap-2.5">
                  <button onClick={resetSession}
                    className="w-7 h-7 rounded-lg flex items-center justify-center text-white/35 hover:text-white hover:bg-white/7 transition-all cursor-pointer">
                    <ArrowLeft className="w-4 h-4"/>
                  </button>
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 rounded-full flex items-center justify-center"
                      style={{ background:'rgba(124,92,255,0.2)', border:'1px solid rgba(124,92,255,0.4)' }}>
                      <Sparkles className="w-3 h-3 text-synapse-400"/>
                    </div>
                    <span className="text-sm text-white/75 font-medium truncate max-w-sm">{sessionTitle}</span>
                    <span className="text-[10px] font-mono text-emerald-400 px-2 py-0.5 rounded-full shrink-0"
                      style={{ background:'rgba(16,185,129,0.1)', border:'1px solid rgba(16,185,129,0.2)' }}>
                      Active
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => navigate('/dashboard')}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs text-white/45 hover:text-white transition-colors cursor-pointer"
                    style={{ background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.08)' }}>
                    <LayoutDashboard className="w-3.5 h-3.5 text-ai-400"/>
                    <span>Dashboard</span>
                  </button>
                  <button onClick={resetSession}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs text-white/45 hover:text-white transition-colors cursor-pointer"
                    style={{ background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.08)' }}>
                    <Plus className="w-3.5 h-3.5"/>
                    <span>New session</span>
                  </button>
                </div>
              </div>

              {/* Scrollable message thread */}
              <div className="flex-1 overflow-y-auto px-5 sm:px-10 lg:px-20 py-8 space-y-6">
                {messages.map(msg => <MessageBubble key={msg.id} msg={msg}/>)}
                {isTyping && <TypingIndicator/>}
                <div ref={chatEndRef}/>
              </div>

              {/* Sticky bottom input */}
              <div className="shrink-0 px-5 sm:px-10 lg:px-20 py-4"
                style={{ background:'rgba(8,9,15,0.75)', backdropFilter:'blur(24px)', borderTop:'1px solid rgba(255,255,255,0.05)' }}>
                <InputBox
                  value={inputVal} onChange={setInputVal}
                  onSend={sendMessage}
                  activeMode={activeMode} onModeChange={setActiveMode}
                />
                <div className="mt-3">
                  <SuggestionChips onSelect={sendMessage} compact/>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </main>
    </div>
  );
}
