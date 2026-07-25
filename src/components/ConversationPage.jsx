import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  Plus, Bookmark, Compass, LayoutGrid,
  MoreHorizontal, Mic, Settings2, MessageSquare,
  ChevronDown, Sparkles, Brain, Cpu,
  Copy, Check, Paperclip, RefreshCw,
  Share2, ThumbsUp, ThumbsDown, Code,
  Download, Clock,
} from 'lucide-react';
import { FloatingDock } from './ui/floating-dock';
import AITextLoading from './ui/ai-text-loading';
import FloatingActionButton from './ui/floating-action-button';
import { getSynthesizedResponse } from '../services/gemini';

/* ════════════════════════════════════════════════════════════════
   1. BACKGROUND — video + wave lines + particles
════════════════════════════════════════════════════════════════ */
function BeamBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none select-none">
      <video
        autoPlay loop muted playsInline
        className="absolute inset-0 w-full h-full object-cover"
        style={{ opacity: 0.55 }}
      >
        <source src="/aurora-1784998368911.webm" type="video/webm" />
      </video>
      <div className="absolute inset-0" style={{ background: 'rgba(0,0,0,0.50)' }} />

      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 1440 900"
        preserveAspectRatio="xMidYMid slice" fill="none">
        <path d="M -60 780 Q 340 500 680 300 Q 860 200 1100 80"
          stroke="rgba(255,255,255,0.055)" strokeWidth="1.4" strokeLinecap="round"/>
        <path d="M -80 850 Q 300 560 660 340 Q 850 225 1120 95"
          stroke="rgba(255,255,255,0.035)" strokeWidth="1.0" strokeLinecap="round"/>
        <path d="M 0 900 Q 380 620 700 400 Q 900 275 1160 120"
          stroke="rgba(255,255,255,0.025)" strokeWidth="0.8" strokeLinecap="round"/>
        <path d="M 1440 900 C 1360 780 1320 660 1380 520 C 1410 455 1440 420 1420 340"
          stroke="rgba(255,255,255,0.06)" strokeWidth="1.2" strokeLinecap="round"/>
        <path d="M 1440 860 C 1350 730 1300 600 1370 470 C 1405 405 1440 375 1415 295"
          stroke="rgba(255,255,255,0.035)" strokeWidth="0.8" strokeLinecap="round"/>
      </svg>

      {[
        { x:'61%', y:'12%', s:1.8, o:0.65 },
        { x:'72%', y:'26%', s:1.1, o:0.40 },
        { x:'66%', y:'47%', s:1.3, o:0.28 },
        { x:'80%', y:'18%', s:1.0, o:0.38 },
        { x:'30%', y:'20%', s:1.0, o:0.30 },
        { x:'22%', y:'43%', s:1.5, o:0.22 },
        { x:'45%', y:'7%',  s:1.2, o:0.50 },
        { x:'88%', y:'36%', s:1.4, o:0.25 },
      ].map((p, i) => (
        <div key={i} className="absolute rounded-full bg-white"
          style={{ left:p.x, top:p.y, width:p.s, height:p.s, opacity:p.o }}/>
      ))}
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════
   2. LOGO MARK
════════════════════════════════════════════════════════════════ */
function LogoMark({ size = 48 }) {
  return (
    <div className="relative flex items-center justify-center" style={{ width: size * 1.8, height: size * 1.8 }}>
      <div className="absolute rounded-full" style={{
        width: size * 1.8, height: size * 1.8,
        background: 'radial-gradient(circle, rgba(180,160,255,0.15) 0%, transparent 65%)',
        filter: 'blur(14px)',
      }}/>
      <div className="absolute rounded-full animate-pulse" style={{
        width: size, height: size,
        background: 'radial-gradient(circle, rgba(255,255,255,0.2) 0%, transparent 65%)',
        filter: 'blur(6px)',
      }}/>
      <svg width={size} height={size} viewBox="0 0 52 52" fill="none" className="relative z-10">
        <line x1="26" y1="9" x2="9"  y2="36" stroke="white" strokeWidth="2.8" strokeLinecap="round"/>
        <line x1="26" y1="9" x2="43" y2="36" stroke="white" strokeWidth="2.8" strokeLinecap="round"/>
        <line x1="17" y1="28" x2="32" y2="20" stroke="white" strokeWidth="2.8" strokeLinecap="round"/>
      </svg>
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════
   3. SIDEBAR
════════════════════════════════════════════════════════════════ */
function Sidebar({ onNavigate }) {
  const navigate = useNavigate();
  const dockItems = [
    { title: 'New Session',  icon: <Plus className="h-full w-full" />,         onClick: () => onNavigate('new') },
    { title: 'History',      icon: <Bookmark className="h-full w-full" />,     onClick: () => {} },
    { title: 'Landing Page', icon: <Compass className="h-full w-full" />,      onClick: () => navigate('/landing') },
    { title: 'All Tools',    icon: <LayoutGrid className="h-full w-full" />,   onClick: () => {} },
    { title: 'More',         icon: <MoreHorizontal className="h-full w-full" />, onClick: () => {} },
  ];
  return (
    <div className="fixed left-4 top-1/2 -translate-y-1/2 z-50">
      <FloatingDock items={dockItems} orientation="vertical" />
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════
   4. TYPEWRITER HOOK
════════════════════════════════════════════════════════════════ */
const PLACEHOLDER_TEXTS = [
  "What do you want to know?",
  "Ask me anything...",
  "Which stream should I choose?",
  "Let's explore an idea together...",
  "What's on your mind today?",
];

function useTypewriter(texts, { typeSpeed = 55, deleteSpeed = 30, pauseMs = 1800 } = {}) {
  const [displayed, setDisplayed] = useState('');
  const [textIndex, setTextIndex] = useState(0);
  const [phase, setPhase] = useState('typing');

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
        setTextIndex(i => (i + 1) % texts.length);
        setPhase('typing');
      }
    }
    return () => clearTimeout(timeout);
  }, [displayed, phase, textIndex, texts, typeSpeed, deleteSpeed, pauseMs]);

  return displayed;
}

/* ════════════════════════════════════════════════════════════════
   5. MARKDOWN RENDERER — renders ** bold **, # headers, - bullets
════════════════════════════════════════════════════════════════ */
function renderMarkdown(text) {
  if (!text) return null;
  const lines = text.split('\n');
  const elements = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    // H1
    if (line.startsWith('# ')) {
      elements.push(
        <h1 key={i} className="text-2xl font-semibold text-white/95 mt-5 mb-2 first:mt-0" style={{ letterSpacing: '-0.02em' }}>
          {parseBold(line.slice(2))}
        </h1>
      );
    }
    // H2
    else if (line.startsWith('## ')) {
      elements.push(
        <h2 key={i} className="text-lg font-semibold text-white/90 mt-5 mb-2 first:mt-0" style={{ letterSpacing: '-0.01em' }}>
          {parseBold(line.slice(3))}
        </h2>
      );
    }
    // H3
    else if (line.startsWith('### ')) {
      elements.push(
        <h3 key={i} className="text-base font-semibold text-white/85 mt-4 mb-1.5 first:mt-0">
          {parseBold(line.slice(4))}
        </h3>
      );
    }
    // Bullet
    else if (line.startsWith('- ') || line.startsWith('• ')) {
      const bullets = [];
      while (i < lines.length && (lines[i].startsWith('- ') || lines[i].startsWith('• '))) {
        bullets.push(
          <li key={i} className="flex gap-2.5 text-white/75 text-[15px] leading-relaxed">
            <span className="mt-2 w-1.5 h-1.5 rounded-full bg-white/40 shrink-0" />
            <span>{parseBold(lines[i].slice(2))}</span>
          </li>
        );
        i++;
      }
      elements.push(<ul key={`ul-${i}`} className="space-y-2 my-2">{bullets}</ul>);
      continue;
    }
    // Numbered list
    else if (/^\d+\.\s/.test(line)) {
      const items = [];
      let num = 1;
      while (i < lines.length && /^\d+\.\s/.test(lines[i])) {
        items.push(
          <li key={i} className="flex gap-2.5 text-white/75 text-[15px] leading-relaxed">
            <span className="text-white/35 text-sm tabular-nums shrink-0 min-w-[1.2rem] text-right">{num}.</span>
            <span>{parseBold(lines[i].replace(/^\d+\.\s/, ''))}</span>
          </li>
        );
        i++;
        num++;
      }
      elements.push(<ol key={`ol-${i}`} className="space-y-2 my-2">{items}</ol>);
      continue;
    }
    // Empty line
    else if (line.trim() === '') {
      // skip extra blanks
    }
    // Normal paragraph
    else {
      elements.push(
        <p key={i} className="text-white/80 text-[15px] leading-relaxed">
          {parseBold(line)}
        </p>
      );
    }

    i++;
  }

  return elements;
}

function parseBold(text) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, idx) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={idx} className="text-white/95 font-semibold">{part.slice(2, -2)}</strong>;
    }
    return <React.Fragment key={idx}>{part}</React.Fragment>;
  });
}

/* ════════════════════════════════════════════════════════════════
   6. INPUT BOX
════════════════════════════════════════════════════════════════ */
function InputBox({ value, onChange, onSend, activeMode, onModeChange, large = false }) {
  const textareaRef = useRef(null);
  const placeholder = useTypewriter(PLACEHOLDER_TEXTS);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 180) + 'px';
    }
  }, [value]);

  const canSend = value.trim().length > 0;

  return (
    <div className="glass-input rounded-2xl w-full relative" style={{ borderRadius: 18 }}>
      {!value && (
        <div
          aria-hidden="true"
          className="absolute pointer-events-none select-none text-[15px] text-white/30 leading-relaxed"
          style={{ top: large ? 20 : 14, left: 20, fontFamily: 'Inter, sans-serif' }}
        >
          {placeholder}
          <span
            className="inline-block w-px h-[1em] bg-white/30 ml-px align-middle"
            style={{ animation: 'blink 1s step-end infinite' }}
          />
        </div>
      )}

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

      <div className="flex items-center justify-between px-4 pb-3.5 pt-1 gap-2">
        <button onClick={() => onModeChange(activeMode === 'Auto' ? 'Focused' : 'Auto')}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs text-white/70 hover:text-white transition-colors cursor-pointer"
          style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.12)' }}>
          <Sparkles className="w-3.5 h-3.5 text-white/70" strokeWidth={1.5}/>
          <span>{activeMode}</span>
          <ChevronDown className="w-3 h-3 text-white/50"/>
        </button>

        <div className="flex items-center gap-2">
          <FloatingActionButton
            size="sm"
            label="Quick Tools"
            positionClassName="relative"
            actions={[
              { id: "attach", label: "Attach File",      icon: <Paperclip className="w-4 h-4 text-white" />, onClick: () => onChange(value + " [Attachment] ") },
              { id: "code",   label: "Insert Code",      icon: <Code className="w-4 h-4 text-white" />,      onClick: () => onChange(value + "\n```js\n// Code here\n```\n") },
              { id: "voice",  label: "Voice Dictation",  icon: <Mic className="w-4 h-4 text-white" />,       onClick: () => {} },
              { id: "settings", label: "Model Settings", icon: <Settings2 className="w-4 h-4 text-white" />, onClick: () => onModeChange(activeMode === "Auto" ? "Focused" : "Auto") },
            ]}
          />
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
   7. USER MESSAGE — small pill on the right
════════════════════════════════════════════════════════════════ */
function UserMessage({ msg }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10, x: 10 }}
      animate={{ opacity: 1, y: 0, x: 0 }}
      transition={{ duration: 0.25 }}
      className="flex justify-end"
    >
      <div
        className="max-w-md text-sm text-white/90 px-4 py-2.5 rounded-full"
        style={{
          background: 'rgba(255,255,255,0.08)',
          border: '1px solid rgba(255,255,255,0.14)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          lineHeight: 1.5,
        }}
      >
        {msg.text}
      </div>
    </motion.div>
  );
}

/* ════════════════════════════════════════════════════════════════
   8. AI MESSAGE — text directly on background, rich markdown
════════════════════════════════════════════════════════════════ */
function AIMessage({ msg, thinkingMs, onRegenerate }) {
  const [copied, setCopied] = useState(false);
  const [liked, setLiked] = useState(null);
  const [showMore, setShowMore] = useState(false);
  const [isRegenerating, setIsRegenerating] = useState(false);
  const moreRef = useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    if (!showMore) return;
    const handler = e => { if (moreRef.current && !moreRef.current.contains(e.target)) setShowMore(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [showMore]);

  const copyText = () => {
    navigator.clipboard.writeText(msg.text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shareResponse = async () => {
    const shareData = { title: 'Synaptica Response', text: msg.text };
    if (navigator.share && navigator.canShare?.(shareData)) {
      try { await navigator.share(shareData); return; } catch {}
    }
    // Fallback: copy to clipboard
    await navigator.clipboard.writeText(msg.text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadResponse = () => {
    const fullText = [
      msg.text,
      msg.aiReasoning ? `\n---\nAI Reasoning:\n${msg.aiReasoning}` : '',
      msg.humanInsight ? `\nHuman Context:\n${msg.humanInsight}` : '',
    ].join('');
    const blob = new Blob([fullText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `synaptica-response-${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleRegenerate = async () => {
    if (isRegenerating || !onRegenerate) return;
    setIsRegenerating(true);
    await onRegenerate();
    setIsRegenerating(false);
  };

  const copyMarkdown = () => {
    navigator.clipboard.writeText(msg.text);
    setShowMore(false);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const thinkingLabel = thinkingMs != null
    ? `Thought for ${Math.round(thinkingMs / 1000)} Second${Math.round(thinkingMs / 1000) !== 1 ? 's' : ''}`
    : null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
      className="flex flex-col gap-3"
    >
      {/* "Thought for N seconds" chip */}
      {thinkingLabel && (
        <div className="flex items-center gap-2">
          <div
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs text-white/40"
            style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}
          >
            <Clock className="w-3 h-3" />
            <span style={{ fontFamily: 'Inter, sans-serif' }}>{thinkingLabel}</span>
          </div>
        </div>
      )}

      {/* Main response — rendered directly on background */}
      <div className="max-w-3xl space-y-1" style={{ fontFamily: 'Inter, sans-serif' }}>
        {renderMarkdown(msg.text)}
      </div>

      {/* Dual-stream insight cards */}
      {(msg.aiReasoning || msg.humanInsight) && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-w-3xl mt-1">
          {msg.aiReasoning && (
            <div className="p-3 rounded-xl text-xs"
              style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
              <div className="flex items-center gap-1.5 mb-1.5 font-mono font-semibold text-white/35">
                <Cpu className="w-3 h-3"/><span>AI Stream</span>
              </div>
              <p className="text-white/45 leading-snug">{msg.aiReasoning}</p>
            </div>
          )}
          {msg.humanInsight && (
            <div className="p-3 rounded-xl text-xs"
              style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
              <div className="flex items-center gap-1.5 mb-1.5 font-mono font-semibold text-white/35">
                <Brain className="w-3 h-3"/><span>Human Context</span>
              </div>
              <p className="text-white/45 leading-snug">{msg.humanInsight}</p>
            </div>
          )}
        </div>
      )}

      {/* Action bar */}
      <div className="flex items-center justify-between max-w-3xl pt-1">
        {/* Left actions */}
        <div className="flex items-center gap-1">
          <ActionBtn title="Share" onClick={shareResponse}>
            <Share2 className="w-3.5 h-3.5" />
          </ActionBtn>
          <ActionBtn title="Download as .txt" onClick={downloadResponse}>
            <Download className="w-3.5 h-3.5" />
          </ActionBtn>
          <ActionBtn title="Copy" onClick={copyText}>
            {copied ? <Check className="w-3.5 h-3.5 text-white/70" /> : <Copy className="w-3.5 h-3.5" />}
          </ActionBtn>
          <ActionBtn title="Regenerate" onClick={handleRegenerate} spinning={isRegenerating}>
            <RefreshCw className={`w-3.5 h-3.5 ${isRegenerating ? 'animate-spin' : ''}`} />
          </ActionBtn>
        </div>

        {/* Right actions */}
        <div className="flex items-center gap-1 relative">
          <ActionBtn title="Good response" onClick={() => setLiked(liked === 'up' ? null : 'up')} active={liked === 'up'}>
            <ThumbsUp className="w-3.5 h-3.5" />
          </ActionBtn>
          <ActionBtn title="Bad response" onClick={() => setLiked(liked === 'down' ? null : 'down')} active={liked === 'down'}>
            <ThumbsDown className="w-3.5 h-3.5" />
          </ActionBtn>
          {/* More dropdown */}
          <div className="relative" ref={moreRef}>
            <ActionBtn title="More options" onClick={() => setShowMore(v => !v)} active={showMore}>
              <MoreHorizontal className="w-3.5 h-3.5" />
            </ActionBtn>
            {showMore && (
              <motion.div
                initial={{ opacity: 0, scale: 0.92, y: 4 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.92, y: 4 }}
                transition={{ duration: 0.14 }}
                className="absolute right-0 bottom-9 z-50 rounded-xl overflow-hidden"
                style={{ background: 'rgba(20,20,20,0.96)', border: '1px solid rgba(255,255,255,0.12)', minWidth: 180, backdropFilter: 'blur(20px)' }}
              >
                {[
                  { label: 'Copy as Markdown', action: copyMarkdown },
                  { label: 'Download .txt',    action: () => { downloadResponse(); setShowMore(false); } },
                  { label: 'Share response',   action: () => { shareResponse(); setShowMore(false); } },
                  { label: 'Report issue',     action: () => setShowMore(false) },
                ].map(item => (
                  <button key={item.label} onClick={item.action}
                    className="w-full text-left px-4 py-2.5 text-[13px] text-white/65 hover:text-white/90 hover:bg-white/[0.06] transition-colors cursor-pointer"
                    style={{ fontFamily: 'Inter, sans-serif' }}
                  >
                    {item.label}
                  </button>
                ))}
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function ActionBtn({ children, title, onClick, active }) {
  return (
    <button
      onClick={onClick}
      title={title}
      className="w-7 h-7 rounded-lg flex items-center justify-center transition-all cursor-pointer"
      style={{
        color: active ? 'rgba(255,255,255,0.75)' : 'rgba(255,255,255,0.28)',
        background: 'transparent',
      }}
      onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.07)'; e.currentTarget.style.color = 'rgba(255,255,255,0.7)'; }}
      onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = active ? 'rgba(255,255,255,0.75)' : 'rgba(255,255,255,0.28)'; }}
    >
      {children}
    </button>
  );
}

/* ════════════════════════════════════════════════════════════════
   9. TYPING INDICATOR
════════════════════════════════════════════════════════════════ */
function TypingIndicator() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col gap-2"
    >
      <div
        className="flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs text-white/35 w-fit"
        style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}
      >
        <Clock className="w-3 h-3" />
        <span style={{ fontFamily: 'Inter, sans-serif' }}>Thinking...</span>
      </div>
      <AITextLoading
        className="text-[15px] text-white/50 leading-relaxed"
        interval={1500}
        texts={[
          "Synthesizing response...",
          "Analyzing context...",
          "Processing thoughts...",
          "Almost ready...",
        ]}
      />
    </motion.div>
  );
}

/* ════════════════════════════════════════════════════════════════
   10. CONVERSATION PAGE — main export
════════════════════════════════════════════════════════════════ */
export default function ConversationPage() {
  const navigate    = useNavigate();
  const chatEndRef  = useRef(null);
  const [messages,   setMessages]   = useState([]);
  const [inputVal,   setInputVal]   = useState('');
  const [isTyping,   setIsTyping]   = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const [activeMode, setActiveMode] = useState('Auto');

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const sendMessage = async text => {
    const t = (text || inputVal).trim();
    if (!t) return;
    setInputVal('');
    setHasStarted(true);

    const startTime = Date.now();

    setMessages(prev => [...prev, {
      id: Date.now(), sender: 'user', text: t,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    }]);
    setIsTyping(true);

    try {
      const response = await getSynthesizedResponse(t, messages);

      const elapsed = Date.now() - startTime;
      const minDelay = 1800;
      if (elapsed < minDelay) {
        await new Promise(resolve => setTimeout(resolve, minDelay - elapsed));
      }

      setIsTyping(false);
      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        sender: 'synaptica',
        text: response.text,
        aiReasoning: response.aiReasoning,
        humanInsight: response.humanInsight,
        thinkingMs: Date.now() - startTime,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      }]);
    } catch (err) {
      console.error('[MindBot] Send error:', err);
      const elapsed = Date.now() - startTime;
      if (elapsed < 1800) await new Promise(r => setTimeout(r, 1800 - elapsed));
      setIsTyping(false);
      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        sender: 'synaptica',
        text: `When choosing between Science, Commerce, or Arts, evaluate your core subject enjoyment against your long-term career goals. What subjects make you lose track of time?`,
        aiReasoning: 'Academic Aptitude: Match subject strengths to target career entry requirements.',
        humanInsight: 'What subject makes you genuinely curious to learn more — not just what seems safe?',
        thinkingMs: Date.now() - startTime,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      }]);
    }
  };

  // Replaces a specific AI message with a fresh Gemini response to the same prompt
  const regenerateMessage = async (aiMsgId, userPrompt, historyBeforeMsg) => {
    if (isTyping) return;

    // Remove the old AI message and show typing indicator
    setMessages(prev => prev.filter(m => m.id !== aiMsgId));
    setIsTyping(true);

    const startTime = Date.now();
    try {
      const response = await getSynthesizedResponse(userPrompt, historyBeforeMsg);
      const elapsed = Date.now() - startTime;
      if (elapsed < 1200) await new Promise(r => setTimeout(r, 1200 - elapsed));

      setIsTyping(false);
      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        sender: 'synaptica',
        text: response.text,
        aiReasoning: response.aiReasoning,
        humanInsight: response.humanInsight,
        thinkingMs: Date.now() - startTime,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      }]);
    } catch {
      setIsTyping(false);
    }
  };

  const resetSession = () => {
    setMessages([]);
    setHasStarted(false);
  };

  return (
    <div className="relative flex h-screen w-screen overflow-hidden bg-black">
      <BeamBackground />

      <Sidebar onNavigate={action => { if (action === 'new') resetSession(); }} />

      <main className="relative z-10 flex-1 flex flex-col overflow-hidden">

        {/* ── WELCOME SCREEN ── */}
        <AnimatePresence mode="wait">
          {!hasStarted && (
            <motion.div key="welcome"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.35 }}
              className="flex-1 flex flex-col items-center justify-center px-6 pb-12">

              <motion.div
                initial={{ opacity: 0, scale: 0.75 }} animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.05, duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
                className="mb-7">
                <LogoMark size={48} />
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15, duration: 0.5 }}
                className="text-4xl sm:text-5xl font-light text-white text-center mb-10"
                style={{ letterSpacing: '-0.03em', lineHeight: 1.1 }}>
                What can I help you<br/><span style={{ opacity: 0.45 }}>explore today?</span>
              </motion.h1>

              <motion.div
                initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.22, duration: 0.5 }}
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

        {/* ── ACTIVE CONVERSATION ── */}
        <AnimatePresence>
          {hasStarted && (
            <motion.div key="chat"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className="flex-1 flex flex-col overflow-hidden">

              {/* Message thread */}
              <div className="flex-1 overflow-y-auto pb-40" style={{ paddingLeft: '5rem', paddingRight: '4rem', paddingTop: '2.5rem' }}>
                <div className="max-w-3xl mx-auto space-y-8">
                  {messages.map((msg, idx) => {
                    if (msg.sender === 'user') return <UserMessage key={msg.id} msg={msg} />;
                    // Find the preceding user message for regenerate
                    const prevUserMsg = [...messages].slice(0, idx).reverse().find(m => m.sender === 'user');
                    const handleRegenerate = prevUserMsg
                      ? () => regenerateMessage(msg.id, prevUserMsg.text, messages.slice(0, idx))
                      : undefined;
                    return <AIMessage key={msg.id} msg={msg} thinkingMs={msg.thinkingMs} onRegenerate={handleRegenerate} />;
                  })}
                  {isTyping && <TypingIndicator />}
                  <div ref={chatEndRef} />
                </div>
              </div>

              {/* Floating input */}
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
