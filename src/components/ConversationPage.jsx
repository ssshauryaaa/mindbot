import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  Plus, Bookmark, Compass, LayoutGrid,
  MoreHorizontal, Mic, Settings2, MessageSquare,
  ChevronDown, ChevronRight, Sparkles, Brain, Cpu, Zap, Globe,
  Copy, Check, Paperclip, RefreshCw,
  Share2, ThumbsUp, ThumbsDown, Code,
  Download, Clock, X, FileText, Image as ImageIcon, File,
  Trash2, Search, Volume2, VolumeX, Star, BarChart2, ArrowUp, Loader2,
  Smartphone, ExternalLink,
} from 'lucide-react';
import { FloatingDock } from './ui/floating-dock';
import AITextLoading from './ui/ai-text-loading';
import FloatingActionButton from './ui/floating-action-button';
import { getSynthesizedResponse } from '../services/aiProvider';
import { generateSmartResponse } from '../services/fallback.js';

import PremiumDualityMeter from "./DualityMeter";
import UserMessage from "./UserMessage";
import HistoryDrawer from "./HistoryDrawer";
import DualitySlider from "./DualitySlider";
import SuggestionChips from "./SuggestionChips";
import { analyzeSentiment } from "../services/sentiment";
import { CodeBlock } from './ui/code-block';
import InsightsPanel from './InsightsPanel';

const PAGE_BG = 'var(--bg-base)'; // resolves to #020203
const GREEN = '#22ff88';
const GREEN_DIM = '#0f7a45';

// WhatsApp number Synaptica runs on — shown in the WhatsApp quick menu below.
const WHATSAPP_DISPLAY_NUMBER = '+1 (555) 659-1524';
const WHATSAPP_DIAL_NUMBER = '15556591524'; // digits only, for wa.me links
const DEMO_PRESETS = [
  'I am in Class 10 and confused between PCM and Commerce. Ask me 4 diagnostic questions, then recommend a stream with reasons.',
  'I feel exam stress and low confidence. Give me a 7-day practical recovery plan with daily milestones.',
  'Create a balanced 12-week roadmap for becoming job-ready in AI + communication skills after Class 12.',
];

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
          stroke="rgba(255,255,255,0.055)" strokeWidth="1.4" strokeLinecap="round" />
        <path d="M -80 850 Q 300 560 660 340 Q 850 225 1120 95"
          stroke="rgba(255,255,255,0.035)" strokeWidth="1.0" strokeLinecap="round" />
        <path d="M 0 900 Q 380 620 700 400 Q 900 275 1160 120"
          stroke="rgba(255,255,255,0.025)" strokeWidth="0.8" strokeLinecap="round" />
        <path d="M 1440 900 C 1360 780 1320 660 1380 520 C 1410 455 1440 420 1420 340"
          stroke="rgba(255,255,255,0.06)" strokeWidth="1.2" strokeLinecap="round" />
        <path d="M 1440 860 C 1350 730 1300 600 1370 470 C 1405 405 1440 375 1415 295"
          stroke="rgba(255,255,255,0.035)" strokeWidth="0.8" strokeLinecap="round" />
      </svg>

      {[
        { x: '61%', y: '12%', s: 1.8, o: 0.65 },
        { x: '72%', y: '26%', s: 1.1, o: 0.40 },
        { x: '66%', y: '47%', s: 1.3, o: 0.28 },
        { x: '80%', y: '18%', s: 1.0, o: 0.38 },
        { x: '30%', y: '20%', s: 1.0, o: 0.30 },
        { x: '22%', y: '43%', s: 1.5, o: 0.22 },
        { x: '45%', y: '7%', s: 1.2, o: 0.50 },
        { x: '88%', y: '36%', s: 1.4, o: 0.25 },
      ].map((p, i) => (
        <div key={i} className="absolute rounded-full bg-white"
          style={{ left: p.x, top: p.y, width: p.s, height: p.s, opacity: p.o }} />
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
      }} />
      <div className="absolute rounded-full animate-pulse" style={{
        width: size, height: size,
        background: 'radial-gradient(circle, rgba(255,255,255,0.2) 0%, transparent 65%)',
        filter: 'blur(6px)',
      }} />
      <svg width={size} height={size} viewBox="0 0 52 52" fill="none" className="relative z-10">
        <line x1="26" y1="9" x2="9" y2="36" stroke="white" strokeWidth="2.8" strokeLinecap="round" />
        <line x1="26" y1="9" x2="43" y2="36" stroke="white" strokeWidth="2.8" strokeLinecap="round" />
        <line x1="17" y1="28" x2="32" y2="20" stroke="white" strokeWidth="2.8" strokeLinecap="round" />
      </svg>
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════
   3. SIDEBAR
════════════════════════════════════════════════════════════════ */
function Sidebar({ onNavigate, hasStarted = false, messages = [] }) {
  const navigate = useNavigate();
  const dockRef = useRef(null);

  useEffect(() => {
    if (!dockRef.current) return;
    const observer = new ResizeObserver(([entry]) => {
      document.documentElement.style.setProperty(
        '--dock-height',
        `${entry.contentRect.height}px`
      );
    });
    observer.observe(dockRef.current);
    return () => observer.disconnect();
  }, []);
  const dockItems = [
    { title: 'New Session', icon: <Plus className="h-full w-full" />, onClick: () => onNavigate('new') },
    { title: 'History', icon: <Bookmark className="h-full w-full" />, onClick: () => onNavigate('history') },
    { title: 'Session Insights', icon: <BarChart2 className="h-full w-full" />, onClick: () => onNavigate('insights') },
    { title: 'Export Chat', icon: <Download className="h-full w-full" />, onClick: () => onNavigate('export') },
    { title: 'Chat on WhatsApp', icon: <MessageSquare className="h-full w-full" />, onClick: () => onNavigate('whatsapp') },
    { title: 'Landing Page', icon: <Compass className="h-full w-full" />, onClick: () => navigate('/landing') },
  ];

  return (
    <>
      {/* Desktop / Tablet — vertical dock floating on the left */}
      <div className="desktop-sidebar fixed left-4 top-1/2 -translate-y-1/2 z-50">
        <FloatingDock items={dockItems} orientation="vertical" />
      </div>

      {/* Mobile — horizontal floating glass capsule dock at bottom center */}
      <div
        ref={dockRef}
        className={`mobile-sidebar fixed left-1/2 -translate-x-1/2 z-40 transition-all duration-300 md:hidden ${hasStarted
          ? 'bottom-[calc(env(safe-area-inset-bottom,0px)+46px)]'
          : 'bottom-[calc(env(safe-area-inset-bottom,0px)+16px)]'
          }`}
      >
        <FloatingDock items={dockItems} orientation="horizontal" />
      </div>
    </>
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

  const elements = [];
  const codeBlockRegex = /```(\w*)\n?([\s\S]*?)```/g;
  let lastIndex = 0;
  let match;
  let blockIndex = 0;

  while ((match = codeBlockRegex.exec(text)) !== null) {
    const [fullMatch, lang, code] = match;
    const textBefore = text.slice(lastIndex, match.index);

    if (textBefore.trim()) {
      elements.push(...renderMarkdownLines(textBefore, `pre-${blockIndex}`));
    }

    elements.push(
      <div key={`code-${blockIndex}`} className="my-3">
        <CodeBlock
          language={lang || 'text'}
          filename={lang ? lang.charAt(0).toUpperCase() + lang.slice(1) : 'Code'}
          code={code.replace(/\n$/, '')}
        />
      </div>
    );

    lastIndex = match.index + fullMatch.length;
    blockIndex++;
  }

  const remaining = text.slice(lastIndex);
  if (remaining.trim()) {
    elements.push(...renderMarkdownLines(remaining, `post-${blockIndex}`));
  }

  return elements;
}

// Handles H1/H2/H3/bullets/numbered lists/paragraphs for a chunk of plain text.
// keyPrefix keeps React keys unique across multiple chunks split around code blocks.
function renderMarkdownLines(text, keyPrefix) {
  const lines = text.split('\n');
  const elements = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    // H1
    if (line.startsWith('# ')) {
      elements.push(
        <h1 key={`${keyPrefix}-${i}`} className="text-2xl font-semibold text-white/95 mt-5 mb-2 first:mt-0" style={{ letterSpacing: '-0.02em' }}>
          {parseBold(line.slice(2))}
        </h1>
      );
    }
    // H2
    else if (line.startsWith('## ')) {
      elements.push(
        <h2 key={`${keyPrefix}-${i}`} className="text-lg font-semibold text-white/90 mt-5 mb-2 first:mt-0" style={{ letterSpacing: '-0.01em' }}>
          {parseBold(line.slice(3))}
        </h2>
      );
    }
    // H3
    else if (line.startsWith('### ')) {
      elements.push(
        <h3 key={`${keyPrefix}-${i}`} className="text-base font-semibold text-white/85 mt-4 mb-1.5 first:mt-0">
          {parseBold(line.slice(4))}
        </h3>
      );
    }
    // Bullet
    else if (line.startsWith('- ') || line.startsWith('• ')) {
      const bullets = [];
      while (i < lines.length && (lines[i].startsWith('- ') || lines[i].startsWith('• '))) {
        bullets.push(
          <li key={`${keyPrefix}-${i}`} className="flex gap-2.5 text-white/75 text-[15px] leading-relaxed">
            <span className="mt-2 w-1.5 h-1.5 rounded-full bg-white/40 shrink-0" />
            <span>{parseBold(lines[i].slice(2))}</span>
          </li>
        );
        i++;
      }
      elements.push(<ul key={`${keyPrefix}-ul-${i}`} className="space-y-2 my-2">{bullets}</ul>);
      continue;
    }
    // Numbered list
    else if (/^\d+\.\s/.test(line)) {
      const items = [];
      let num = 1;
      while (i < lines.length && /^\d+\.\s/.test(lines[i])) {
        items.push(
          <li key={`${keyPrefix}-${i}`} className="flex gap-2.5 text-white/75 text-[15px] leading-relaxed">
            <span className="text-white/35 text-sm tabular-nums shrink-0 min-w-[1.2rem] text-right">{num}.</span>
            <span>{parseBold(lines[i].replace(/^\d+\.\s/, ''))}</span>
          </li>
        );
        i++;
        num++;
      }
      elements.push(<ol key={`${keyPrefix}-ol-${i}`} className="space-y-2 my-2">{items}</ol>);
      continue;
    }
    // Empty line
    else if (line.trim() === '') {
      // skip extra blanks
    }
    // Normal paragraph
    else {
      elements.push(
        <p key={`${keyPrefix}-${i}`} className="text-white/80 text-[15px] leading-relaxed">
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

function formatFileSize(bytes) {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
}

function ModelSelector({ activeProvider, onProviderChange, isDropUp = false }) {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const providers = [
    {
      id: 'groq',
      title: 'Groq',
      desc: 'Ultra-fast synthesis powered by Groq Llama 3.3',
      icon: <Zap className="w-4 h-4 text-orange-400 shrink-0" />,
    },
    {
      id: 'gemini',
      title: 'Gemini 3.6 Flash',
      desc: 'Fast, high precision multimodal intelligence',
      icon: <Sparkles className="w-4 h-4 text-sky-400 shrink-0" />,
    },

    {
      id: 'openrouter',
      title: 'OpenRouter',
      desc: 'Auto-routed access to free open-source models via OpenRouter',
      icon: <Globe className="w-4 h-4 text-emerald-400 shrink-0" />,
    },
  ];

  const current = providers.find(p => p.id === activeProvider) || providers[0];

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setOpen(v => !v)}
        className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-medium text-white/90 hover:text-white transition-all cursor-pointer select-none"
        style={{
          background: 'rgba(255, 255, 255, 0.06)',
          border: open ? '1px solid rgba(255, 255, 255, 0.28)' : '1px solid rgba(255, 255, 255, 0.12)',
          backdropFilter: 'blur(12px)',
        }}
        title="Select AI Engine"
      >
        {current.icon}
        <span style={{ fontFamily: 'Space Grotesk, sans-serif', letterSpacing: '-0.01em' }}>
          {current.title}
        </span>
        <ChevronDown className={`w-3 h-3 text-white/50 transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: isDropUp ? 8 : -8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: isDropUp ? 6 : -6, scale: 0.95 }}
            transition={{ duration: 0.16, ease: [0.16, 1, 0.3, 1] }}
            className={`absolute ${isDropUp ? 'bottom-full mb-2.5' : 'top-full mt-2.5'} left-0 z-[150] w-64 p-1.5 rounded-2xl overflow-hidden shadow-2xl`}
            style={{
              background: 'rgba(5, 5, 8, 0.96)',
              border: '1px solid rgba(255, 255, 255, 0.16)',
              backdropFilter: 'blur(24px)',
              WebkitBackdropFilter: 'blur(24px)',
              boxShadow: '0 12px 40px rgba(0, 0, 0, 0.9), inset 0 1px 0 rgba(255, 255, 255, 0.08)',
            }}
          >
            {providers.map(item => {
              const isActive = activeProvider === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    onProviderChange?.(item.id);
                    setOpen(false);
                  }}
                  className="w-full text-left p-2.5 rounded-xl flex items-start gap-2.5 transition-all cursor-pointer group relative mb-0.5"
                  style={{
                    background: isActive ? 'rgba(255, 255, 255, 0.10)' : 'transparent',
                    border: isActive ? '1px solid rgba(255, 255, 255, 0.20)' : '1px solid transparent',
                  }}
                >
                  <div className="mt-0.5">{item.icon}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-white/95 group-hover:text-white" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                        {item.title}
                      </span>
                      {isActive && (
                        <div className="w-1.5 h-1.5 rounded-full bg-white shadow-[0_0_8px_#ffffff]" />
                      )}
                    </div>
                    <p className="text-[11px] text-white/40 group-hover:text-white/65 leading-tight mt-0.5" style={{ fontFamily: 'Inter, sans-serif' }}>
                      {item.desc}
                    </p>
                  </div>
                </button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function InputBox({ value, onChange, onSend, placeholder, large = false, activeMode, onModeChange, activeProvider = 'groq', onProviderChange, dropUp }) {
  const [attachments, setAttachments] = useState([]);
  const [isListening, setIsListening] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [justSent, setJustSent] = useState(false);
  const [ripple, setRipple] = useState(false);
  const dragCounter = useRef(0);
  const fileInputRef = useRef(null);
  const textareaRef = useRef(null);

  // If dropUp is specified use it, otherwise open downward when large (welcome screen) and upward when small (active chat)
  const isDropUp = dropUp !== undefined ? dropUp : !large;


  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 180) + 'px';
    }
  }, [value]);

  const [toast, setToast] = useState(null); // { id, message, isImage }

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(null), 2800);
    return () => clearTimeout(timer);
  }, [toast]);

  const ingestFiles = (fileList) => {
    const files = Array.from(fileList || []);
    if (!files.length) return;

    const newAttachments = files.map(file => ({
      id: Math.random().toString(36).substr(2, 9),
      name: file.name,
      size: formatFileSize(file.size),
      type: file.type,
      fileObj: file,
      previewUrl: file.type.startsWith('image/') ? URL.createObjectURL(file) : null,
    }));

    setAttachments(prev => [...prev, ...newAttachments]);

    const firstFile = files[0];
    const isImg = firstFile.type.startsWith('image/');
    const label = files.length > 1 ? `${files.length} files attached` : isImg ? `Image uploaded: ${firstFile.name}` : `File attached: ${firstFile.name}`;
    setToast({ id: Date.now(), message: label, isImage: isImg });
  };

  const handleFileSelect = (e) => {
    ingestFiles(e.target.files);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const removeAttachment = (id) => {
    setAttachments(prev => {
      const target = prev.find(a => a.id === id);
      if (target?.previewUrl) URL.revokeObjectURL(target.previewUrl);
      return prev.filter(a => a.id !== id);
    });
  };

  // Drag-and-drop attach: only the file-drag surface, guarded with a
  // counter so nested enter/leave events (child elements) don't flicker it.
  const handleDragEnter = (e) => {
    e.preventDefault();
    if (!e.dataTransfer?.types?.includes('Files')) return;
    dragCounter.current += 1;
    setIsDragging(true);
  };
  const handleDragOver = (e) => {
    e.preventDefault();
  };
  const handleDragLeave = (e) => {
    e.preventDefault();
    dragCounter.current -= 1;
    if (dragCounter.current <= 0) {
      dragCounter.current = 0;
      setIsDragging(false);
    }
  };
  const handleDrop = (e) => {
    e.preventDefault();
    dragCounter.current = 0;
    setIsDragging(false);
    ingestFiles(e.dataTransfer?.files);
  };

  const recognitionRef = useRef(null);
  const isListeningRef = useRef(false);
  const [interimText, setInterimText] = useState('');

  const handleVoiceDictation = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setToast({ id: Date.now(), message: 'Voice dictation is not supported in this browser (use Chrome/Edge).' });
      return;
    }

    if (isListening) {
      isListeningRef.current = false;
      if (recognitionRef.current) {
        try { recognitionRef.current.stop(); } catch { }
      }
      setIsListening(false);
      setInterimText('');
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognitionRef.current = recognition;
      recognition.continuous = false; // Fast per-phrase commit
      recognition.interimResults = true;
      recognition.lang = navigator.language || 'en-US';

      isListeningRef.current = true;
      setIsListening(true);
      setInterimText('');

      recognition.onstart = () => {
        setToast({ id: Date.now(), message: '🎙️ Listening... Speak now!' });
      };

      recognition.onend = () => {
        if (isListeningRef.current) {
          try { recognition.start(); } catch { }
        } else {
          setIsListening(false);
          setInterimText('');
          recognitionRef.current = null;
        }
      };

      recognition.onerror = (event) => {
        console.warn('[MindBot] Speech recognition error:', event.error);
        if (event.error === 'not-allowed' || event.error === 'service-not-allowed') {
          isListeningRef.current = false;
          setIsListening(false);
          setInterimText('');
          setToast({ id: Date.now(), message: '⚠️ Microphone access denied in browser.' });
        } else if (event.error === 'network') {
          isListeningRef.current = false;
          setIsListening(false);
          setInterimText('');
          setToast({ id: Date.now(), message: '⚠️ Speech recognition requires internet connection.' });
        }
      };

      recognition.onresult = (e) => {
        let transcript = '';
        for (let i = e.resultIndex; i < e.results.length; i++) {
          transcript += e.results[i][0].transcript;
        }
        if (transcript) {
          setInterimText(transcript);
          // When a phrase segment finishes, commit it directly to the textarea
          if (e.results[e.resultIndex]?.isFinal) {
            const finalPhrase = transcript.trim();
            onChange(prev => (typeof prev === 'string' && prev ? prev.trim() + ' ' : '') + finalPhrase);
            setInterimText('');
          }
        }
      };

      recognition.start();
    } catch (err) {
      console.error('[MindBot] Speech start error:', err);
      setIsListening(false);
      isListeningRef.current = false;
    }
  };

  const handleSend = () => {
    if (!value.trim() && !attachments.length) return;
    setRipple(true);
    setTimeout(() => setRipple(false), 600);
    onSend(value, attachments);
    setAttachments([]);
    setJustSent(true);
    setTimeout(() => setJustSent(false), 1400);
  };

  const canSend = value.trim().length > 0 || attachments.length > 0;

  return (
    <div
      className="glass-input rounded-2xl w-full relative transition-shadow duration-300"
      style={{
        borderRadius: 18,
        boxShadow: isDragging ? '0 0 0 1.5px rgba(52,211,153,0.5), 0 0 32px rgba(52,211,153,0.15)' : 'none',
      }}
      onDragEnter={handleDragEnter}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <style>{`
        @keyframes tts-wave {
          0%, 100% { transform: scaleY(0.3); }
          50% { transform: scaleY(1); }
        }
        @keyframes ib-wave {
          0%, 100% { transform: scaleY(0.35); }
          50% { transform: scaleY(1); }
        }
        .ib-bar { animation: ib-wave 0.9s ease-in-out infinite; transform-origin: center; }
        @keyframes ringPulse {
          0% { box-shadow: 0 0 0 0 rgba(34,255,136,0.55); }
          100% { box-shadow: 0 0 0 16px rgba(34,255,136,0); }
        }
        @keyframes rippleExpand {
          0% { transform: scale(0); opacity: 0.55; }
          100% { transform: scale(2.6); opacity: 0; }
        }
        .send-pulse-ring::after {
          content: '';
          position: absolute;
          inset: 0;
          border-radius: 10px;
          animation: ringPulse 0.7s ease-out;
        }
        .send-ripple {
          position: absolute;
          inset: 0;
          border-radius: 10px;
          background: radial-gradient(circle, rgba(34,255,136,0.6) 0%, transparent 70%);
          animation: rippleExpand 0.6s ease-out forwards;
          pointer-events: none;
        }
        @media (prefers-reduced-motion: reduce) {
          .ib-bar { animation: none; }
          .send-pulse-ring::after { animation: none; }
        }
      `}</style>

      {/* Drag-to-attach overlay */}
      <AnimatePresence>
        {isDragging && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-40 rounded-2xl flex flex-col items-center justify-center gap-1.5 pointer-events-none"
            style={{
              background: 'rgba(6, 8, 10, 0.82)',
              border: '1.5px dashed rgba(52,211,153,0.55)',
              backdropFilter: 'blur(6px)',
            }}
          >
            <motion.div
              animate={{ y: [0, -4, 0] }}
              transition={{ duration: 1.1, repeat: Infinity, ease: 'easeInOut' }}
              className="w-9 h-9 rounded-xl bg-emerald-400/15 border border-emerald-400/30 flex items-center justify-center"
            >
              <Paperclip className="w-4 h-4 text-emerald-300" />
            </motion.div>
            <span className="text-xs font-medium text-emerald-200" style={{ fontFamily: 'Inter, sans-serif' }}>
              Drop to attach
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toast Notification */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute -top-12 left-1/2 -translate-x-1/2 flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-medium text-white shadow-xl z-50 pointer-events-none"
            style={{
              background: 'rgba(20, 20, 20, 0.92)',
              border: '1px solid rgba(255, 255, 255, 0.18)',
              backdropFilter: 'blur(16px)',
            }}
          >
            <div className="w-4 h-4 rounded-full bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center">
              <Check className="w-2.5 h-2.5 text-emerald-400" />
            </div>
            <span className="truncate max-w-[240px]" style={{ fontFamily: 'Inter, sans-serif' }}>
              {toast.message}
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hidden File Input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileSelect}
        multiple
        className="hidden"
      />

      {/* Attachment Badges Row — Bigger Image Previews */}
      {attachments.length > 0 && (
        <div className="flex flex-wrap items-center gap-3 px-4 pt-3.5 pb-1">
          <AnimatePresence mode="popLayout">
            {attachments.map(att => (
              <motion.div
                key={att.id}
                layout
                initial={{ opacity: 0, scale: 0.88 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.88 }}
                className="relative group flex items-center"
              >
                {att.previewUrl ? (
                  /* Enlarged Image Card Preview */
                  <div
                    className="relative flex items-center gap-3 pr-8 p-1.5 rounded-2xl overflow-hidden"
                    style={{
                      background: 'rgba(255,255,255,0.07)',
                      border: '1px solid rgba(255,255,255,0.15)',
                      backdropFilter: 'blur(16px)',
                    }}
                  >
                    <img
                      src={att.previewUrl}
                      alt={att.name}
                      className="w-14 h-14 rounded-xl object-cover border border-white/20 shadow-md shrink-0 transition-transform duration-300 group-hover:scale-105"
                    />
                    <div className="flex flex-col min-w-0 pr-1">
                      <span className="text-xs text-white/90 font-medium truncate max-w-[130px]" style={{ fontFamily: 'Inter, sans-serif' }}>
                        {att.name}
                      </span>
                      <span className="text-[10px] text-white/40 font-mono mt-0.5">{att.size}</span>
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.12 }}
                      whileTap={{ scale: 0.88 }}
                      onClick={() => removeAttachment(att.id)}
                      className="absolute top-2 right-2 w-5 h-5 rounded-full bg-white/10 hover:bg-white/25 border border-white/20 flex items-center justify-center text-white/70 hover:text-white transition-colors cursor-pointer"
                      title="Remove image"
                    >
                      <X className="w-3 h-3" />
                    </motion.button>
                  </div>
                ) : (
                  /* Document/File Card Preview */
                  <div
                    className="relative flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs text-white/88"
                    style={{
                      background: 'rgba(255,255,255,0.07)',
                      border: '1px solid rgba(255,255,255,0.14)',
                      backdropFilter: 'blur(16px)',
                    }}
                  >
                    <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center shrink-0">
                      <FileText className="w-4 h-4 text-white/80" />
                    </div>
                    <div className="flex flex-col min-w-0 pr-2">
                      <span className="truncate max-w-[130px] font-medium" style={{ fontFamily: 'Inter, sans-serif' }}>
                        {att.name}
                      </span>
                      <span className="text-[10px] text-white/40 font-mono">{att.size}</span>
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.15 }}
                      whileTap={{ scale: 0.88 }}
                      onClick={() => removeAttachment(att.id)}
                      className="hover:text-white text-white/40 ml-1 transition-colors cursor-pointer"
                      title="Remove file"
                    >
                      <X className="w-3.5 h-3.5" />
                    </motion.button>
                  </div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Animated typewriter placeholder */}
      {!value && attachments.length === 0 && (
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
        onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
        placeholder=""
        rows={large ? 3 : 1}
        className="w-full bg-transparent resize-none px-5 pt-4 pb-1 text-[15px] text-white/90 focus:outline-none leading-relaxed"
        style={{ fontFamily: 'Inter, sans-serif', minHeight: large ? 72 : 44 }}
      />

      {/* Live listening indicator */}
      <AnimatePresence>
        {isListening && (
          <motion.div
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 4 }}
            className="flex items-center gap-2 px-5 pb-1.5 -mt-1"
          >
            <div className="flex items-end gap-[2.5px] h-3.5">
              {[0, 1, 2, 3, 4].map(i => (
                <span
                  key={i}
                  className="ib-bar w-[2.5px] rounded-full bg-red-400"
                  style={{ height: '100%', animationDelay: `${i * 0.12}s` }}
                />
              ))}
            </div>
            <span className="text-[11px] text-red-300/90 font-medium truncate max-w-md" style={{ fontFamily: 'Inter, sans-serif' }}>
              Listening… {interimText ? <span className="text-white/80 font-normal italic ml-1">"{interimText}"</span> : <span className="opacity-60 ml-1">Speak now...</span>}
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex flex-wrap items-center justify-between px-3 sm:px-4 pb-3.5 pt-1 gap-2">
        <div className="flex items-center gap-2">
          {/* Left action area — clean & minimal */}
        </div>

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
                onClick: () => fileInputRef.current?.click(),
              },
              {
                id: "code",
                label: "Insert Code",
                icon: <Code className="w-4 h-4 text-white" />,
                onClick: () => onChange(value + (value ? "\n" : "") + "```js\n// Write code here\n```\n"),
              },
              {
                id: "voice",
                label: isListening ? "Stop Listening" : "Voice Dictation",
                icon: <Mic className={`w-4 h-4 ${isListening ? 'text-red-400 animate-pulse' : 'text-white'}`} />,
                onClick: handleVoiceDictation,
              },
              // {
              //   id: "settings",
              //   label: "Model Settings",
              //   icon: <Settings2 className="w-4 h-4 text-white" />,
              //   onClick: () => onModeChange(activeMode === "Auto" ? "Focused" : "Auto"),
              // },
            ]}
          />
          <motion.button
            onClick={handleSend}
            disabled={!canSend}
            aria-label="Send"
            whileHover={canSend ? { scale: 1.08, y: -1 } : {}}
            whileTap={canSend ? { scale: 0.88 } : {}}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 400, damping: 20 }}
            initial={false}
            className={`relative w-9 h-9 rounded-[10px] flex items-center justify-center cursor-pointer overflow-hidden ${justSent ? 'send-pulse-ring' : ''}`}
            style={{
              background: canSend || justSent
                ? `linear-gradient(155deg, ${GREEN}, ${GREEN_DIM})`
                : 'rgba(255,255,255,0.05)',
              border: canSend || justSent ? `1px solid ${GREEN}` : '1px solid rgba(255,255,255,0.08)',
              boxShadow: canSend
                ? `0 0 0 1px rgba(34,255,136,0.15), 0 4px 16px rgba(34,255,136,0.35), inset 0 1px 0 rgba(255,255,255,0.4)`
                : 'none',
              opacity: canSend || justSent ? 1 : 0.35,
              transition: 'background 0.25s ease, border-color 0.25s ease, box-shadow 0.25s ease, opacity 0.25s ease',
            }}
          >
            {ripple && <span className="send-ripple" />}

            <AnimatePresence mode="wait" initial={false}>
              {justSent ? (
                <motion.span
                  key="sent"
                  initial={{ scale: 0.4, opacity: 0, rotate: -45 }}
                  animate={{ scale: 1, opacity: 1, rotate: 0 }}
                  exit={{ scale: 0.4, opacity: 0 }}
                  transition={{ type: 'spring', stiffness: 500, damping: 22 }}
                >
                  <Check className="w-4 h-4 text-black" strokeWidth={2.5} />
                </motion.span>
              ) : (
                <motion.span
                  key="send"
                  initial={{ scale: 0.5, opacity: 0, y: 4 }}
                  animate={{ scale: 1, opacity: 1, y: 0 }}
                  exit={{ scale: 0.5, opacity: 0, y: -6 }}
                  whileHover={canSend ? { y: -2 } : {}}
                  transition={{ type: 'spring', stiffness: 450, damping: 18 }}
                >
                  <ArrowUp
                    className={`w-4 h-4 ${canSend ? 'text-black' : 'text-white/30'}`}
                    strokeWidth={2.5}
                  />
                </motion.span>
              )}
            </AnimatePresence>
          </motion.button>
        </div>
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════
   8. AI MESSAGE — text directly on background, rich markdown
════════════════════════════════════════════════════════════════ */
function AIMessage({ msg, thinkingMs, onRegenerate, isStarred = false, onStar }) {
  const [copied, setCopied] = useState(false);
  const [liked, setLiked] = useState(null);
  const [feedbackToast, setFeedbackToast] = useState(null);
  const [showMore, setShowMore] = useState(false);
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const moreRef = useRef(null);

  useEffect(() => {
    if (!feedbackToast) return;
    const timer = setTimeout(() => setFeedbackToast(null), 2600);
    return () => clearTimeout(timer);
  }, [feedbackToast]);

  const showFeedback = (message) => {
    setFeedbackToast({ id: Date.now(), message });
  };

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

  // ── Text-to-Speech ──────────────────────────────────────────────
  const handleSpeak = () => {
    if (!window.speechSynthesis) return;

    // If already speaking, stop
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    // Strip markdown formatting before reading aloud
    const cleanText = (msg.text || '')
      .replace(/```[\s\S]*?```/g, 'code block omitted.')
      .replace(/#{1,6}\s?/g, '')
      .replace(/\*\*(.*?)\*\*/g, '$1')
      .replace(/\*(.*?)\*/g, '$1')
      .replace(/[-•]\s/g, ', ')
      .replace(/\n+/g, ' ')
      .trim();

    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.rate = 0.95;
    utterance.pitch = 1.05;
    utterance.volume = 1;

    // Prefer a natural-sounding voice if available
    const voices = window.speechSynthesis.getVoices();
    const preferred = voices.find(v =>
      v.name.toLowerCase().includes('google') ||
      v.name.toLowerCase().includes('natural') ||
      v.name.toLowerCase().includes('neural')
    ) || voices.find(v => v.lang.startsWith('en')) || voices[0];
    if (preferred) utterance.voice = preferred;

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.cancel(); // clear any previous queue
    window.speechSynthesis.speak(utterance);
  };

  // Stop speech if the component unmounts
  useEffect(() => {
    return () => { if (isSpeaking) window.speechSynthesis?.cancel(); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const shareResponse = async () => {
    const shareData = { title: 'SYNAPTICA by Pyrobot', text: msg.text };
    if (navigator.share && navigator.canShare?.(shareData)) {
      try { await navigator.share(shareData); return; } catch { }
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
    a.download = `pyrobot-${Date.now()}.txt`;
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
  const providerLabel = msg.provider === 'groq'
    ? 'Groq'
    : msg.provider === 'openrouter'
      ? 'OpenRouter'
      : msg.provider === 'grok'
        ? 'Grok'
        : msg.provider === 'fallback'
          ? 'Local Fallback'
          : 'Gemini';
  const latencyLabel = msg.thinkingMs != null ? `${Math.max(1, Math.round(msg.thinkingMs))}ms` : null;

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

      {/* Runtime metadata chips for judging clarity */}
      <div className="flex flex-wrap items-center gap-2">
        <div
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs text-white/55"
          style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.10)' }}
        >
          <Sparkles className="w-3 h-3" />
          <span>{providerLabel}</span>
        </div>
        {msg.modelUsed && (
          <div
            className="px-2.5 py-1 rounded-md text-xs text-white/50"
            style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}
          >
            {msg.modelUsed}
          </div>
        )}
        {msg.modeName && (
          <div
            className="px-2.5 py-1 rounded-md text-xs text-white/50"
            style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}
          >
            {msg.modeName}
          </div>
        )}
        {latencyLabel && (
          <div
            className="px-2.5 py-1 rounded-md text-xs text-white/50"
            style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}
          >
            {latencyLabel}
          </div>
        )}
        {msg.isFallback && (
          <div
            className="px-2.5 py-1 rounded-md text-xs font-medium text-emerald-200"
            style={{ background: 'rgba(16,185,129,0.12)', border: '1px solid rgba(16,185,129,0.35)' }}
          >
            Local Fallback Active
          </div>
        )}
      </div>

      {/* Main response — rendered directly on background */}
      <div className="max-w-3xl space-y-1" style={{ fontFamily: 'Inter, sans-serif' }}>
        {renderMarkdown(msg.text)}
      </div>

      {/* Dual-stream insight cards — Monochrome */}
      <PremiumDualityMeter
        aiReasoning={msg.aiReasoning}
        humanInsight={msg.humanInsight}
        logicRatio={msg.logicRatio}
        empathyRatio={msg.empathyRatio}
        provider={msg.provider}
        modeName={msg.modeName}
      />

      {/* Action bar */}
      <div className="flex flex-wrap items-center justify-between max-w-3xl pt-1 gap-y-1">
        {/* Left actions */}
        <div className="flex items-center gap-0.5 sm:gap-1">
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

          {/* ── Star / Pin button ── */}
          {!msg.isError && onStar && (
            <button
              onClick={() => onStar(msg)}
              title={isStarred ? 'Remove from starred' : 'Star this response'}
              className="w-7 h-7 rounded-lg flex items-center justify-center transition-all cursor-pointer"
              style={{
                color: isStarred ? '#fbbf24' : 'rgba(255,255,255,0.28)',
                background: isStarred ? 'rgba(251,191,36,0.10)' : 'transparent',
                border: isStarred ? '1px solid rgba(251,191,36,0.25)' : '1px solid transparent',
              }}
              onMouseEnter={e => {
                if (!isStarred) {
                  e.currentTarget.style.background = 'rgba(251,191,36,0.08)';
                  e.currentTarget.style.color = '#fbbf24';
                }
              }}
              onMouseLeave={e => {
                if (!isStarred) {
                  e.currentTarget.style.background = 'transparent';
                  e.currentTarget.style.color = 'rgba(255,255,255,0.28)';
                }
              }}
            >
              <Star className="w-3.5 h-3.5" fill={isStarred ? '#fbbf24' : 'none'} />
            </button>
          )}

          {/* ── Text-to-Speech button ── */}
          {!msg.isError && (
            <button
              onClick={handleSpeak}
              title={isSpeaking ? 'Stop speaking' : 'Read aloud'}
              className="relative w-7 h-7 rounded-lg flex items-center justify-center transition-all cursor-pointer overflow-hidden"
              style={{
                color: isSpeaking ? '#a78bfa' : 'rgba(255,255,255,0.28)',
                background: isSpeaking ? 'rgba(167,139,250,0.12)' : 'transparent',
                border: isSpeaking ? '1px solid rgba(167,139,250,0.3)' : '1px solid transparent',
              }}
              onMouseEnter={e => {
                if (!isSpeaking) {
                  e.currentTarget.style.background = 'rgba(255,255,255,0.07)';
                  e.currentTarget.style.color = 'rgba(255,255,255,0.7)';
                }
              }}
              onMouseLeave={e => {
                if (!isSpeaking) {
                  e.currentTarget.style.background = 'transparent';
                  e.currentTarget.style.color = 'rgba(255,255,255,0.28)';
                }
              }}
            >
              {isSpeaking ? (
                /* Animated waveform bars while speaking */
                <span className="flex items-end gap-[1.5px] h-3.5">
                  {[0, 1, 2, 3].map(i => (
                    <span
                      key={i}
                      style={{
                        display: 'inline-block',
                        width: 2,
                        borderRadius: 2,
                        background: '#a78bfa',
                        height: '100%',
                        animation: 'tts-wave 0.8s ease-in-out infinite',
                        animationDelay: `${i * 0.13}s`,
                        transformOrigin: 'bottom',
                      }}
                    />
                  ))}
                </span>
              ) : (
                <Volume2 className="w-3.5 h-3.5" />
              )}
            </button>
          )}
        </div>

        {/* Right actions */}
        <div className="flex items-center gap-1 relative">
          <ActionBtn
            title="Good response"
            onClick={() => {
              const next = liked === 'up' ? null : 'up';
              setLiked(next);
              showFeedback(next ? 'Thanks for the thumbs up!' : 'Feedback cleared.');
            }}
            active={liked === 'up'}
          >
            <ThumbsUp className="w-3.5 h-3.5" />
          </ActionBtn>
          <ActionBtn
            title="Bad response"
            onClick={() => {
              const next = liked === 'down' ? null : 'down';
              setLiked(next);
              showFeedback(next ? 'Got it — I’ll learn from this.' : 'Feedback cleared.');
            }}
            active={liked === 'down'}
          >
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
                  { label: 'Download .txt', action: () => { downloadResponse(); setShowMore(false); } },
                  { label: 'Share response', action: () => { shareResponse(); setShowMore(false); } },
                  { label: 'Report issue', action: () => setShowMore(false) },
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

      <AnimatePresence>
        {feedbackToast && (
          <motion.div
            key={feedbackToast.id}
            initial={{ opacity: 0, y: -8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.18 }}
            className="pointer-events-none absolute left-1/2 top-0 z-40 -translate-x-1/2 -translate-y-full flex items-center gap-2 rounded-2xl px-3 py-2 text-[12px] font-medium text-white shadow-2xl"
            style={{
              minWidth: '220px',
              maxWidth: 'calc(100vw - 2rem)',
              background: 'rgba(15, 18, 25, 0.96)',
              border: '1px solid rgba(255,255,255,0.12)',
              backdropFilter: 'blur(18px)',
            }}
          >
            <div className="w-4 h-4 rounded-full bg-emerald-400/15 flex items-center justify-center border border-emerald-400/30">
              <Check className="w-2.5 h-2.5 text-emerald-300" />
            </div>
            <span className="truncate" style={{ fontFamily: 'Inter, sans-serif' }}>
              {feedbackToast.message}
            </span>
          </motion.div>
        )}
      </AnimatePresence>
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
function TypingIndicator({ sentiment }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col gap-2"
    >
      <div className="flex items-center gap-2">
        <div
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs text-white/35 w-fit"
          style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}
        >
          <Clock className="w-3 h-3" />
          <span style={{ fontFamily: 'Inter, sans-serif' }}>Thinking...</span>
        </div>

        {sentiment?.shiftDescription && (
          <motion.div
            initial={{ opacity: 0, scale: 0.88 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-mono text-emerald-300/90 bg-emerald-400/10 border border-emerald-400/25 shadow-[0_0_12px_rgba(52,211,153,0.15)]"
          >
            <span>{sentiment.shiftDescription}</span>
          </motion.div>
        )}
      </div>

      <AITextLoading
        className="text-[15px] text-white/50 leading-relaxed"
        interval={1500}
        texts={[
          "Synthesizing response...",
          "Analyzing context & tone...",
          "Processing dual-stream thoughts...",
          "Almost ready...",
        ]}
      />
    </motion.div>
  );
}



/* ════════════════════════════════════════════════════════════════
   10. EXPORT QUICK MENU — 3D Tilt & Glass Sheen
════════════════════════════════════════════════════════════════ */
function ExportQuickMenu({ isOpen, onClose, onExportMarkdown, onExportPDF, hasMessages }) {
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [hoveredItem, setHoveredItem] = useState(null);
  const [isMobile, setIsMobile] = useState(
    () => typeof window !== 'undefined' && window.matchMedia('(max-width: 767px)').matches
  );
  const menuRef = useRef(null);

  useEffect(() => {
    const mql = window.matchMedia('(max-width: 767px)');
    const handler = (e) => setIsMobile(e.matches);
    mql.addEventListener('change', handler);
    return () => mql.removeEventListener('change', handler);
  }, []);

  if (!isOpen) return null;

  const handleMouseMove = (e) => {
    if (!menuRef.current || isMobile) return;
    const rect = menuRef.current.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    setTilt({ x: py * -14, y: px * 14 });
  };

  const handleMouseLeave = () => setTilt({ x: 0, y: 0 });

  const items = [
    {
      key: 'md',
      label: 'Download as Markdown',
      sub: '.md file',
      icon: FileText,
      accentColor: '#34d399',
      onClick: () => { onExportMarkdown(); onClose(); },
    },
    {
      key: 'pdf',
      label: 'Print / Save as PDF',
      sub: '.pdf file',
      icon: Download,
      accentColor: '#a78bfa',
      onClick: () => { onExportPDF(); onClose(); },
    },
  ];

  return (
    <>
      <style>{`
        @keyframes panelPopIn {
          0% {
            opacity: 0;
            transform: translateY(-50%) scale(0.9);
            filter: blur(6px);
          }
          60% {
            opacity: 1;
            transform: translateY(-50%) scale(1.02);
            filter: blur(0px);
          }
          100% {
            opacity: 1;
            transform: translateY(-50%) scale(1);
            filter: blur(0px);
          }
        }
        @keyframes panelPopOut {
          0% {
            opacity: 1;
            transform: translateY(-50%) scale(1);
            filter: blur(0px);
          }
          100% {
            opacity: 0;
            transform: translateY(-50%) scale(0.9);
            filter: blur(4px);
          }
        }
        @keyframes itemSlideIn {
          0% { opacity: 0; transform: translateX(-14px); }
          100% { opacity: 1; transform: translateX(0); }
        }
        @keyframes backdropFade {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes backdropFadeOut {
          from { opacity: 1; }
          to { opacity: 0; }
        }
        @keyframes sheen {
          0% { transform: translateX(-120%) skewX(-20deg); }
          100% { transform: translateX(220%) skewX(-20deg); }
        }
        .menu-item {
          position: relative;
          transition: transform 0.22s cubic-bezier(0.22, 1, 0.36, 1), background 0.2s ease;
        }
        .menu-item:hover:not(:disabled) {
          background: rgba(255,255,255,0.07) !important;
          transform: translateX(4px);
        }
        .menu-item:active:not(:disabled) {
          transform: translateX(2px) scale(0.985);
        }
        .menu-item-icon {
          transition: transform 0.25s cubic-bezier(0.34, 1.56, 0.64, 1), filter 0.25s ease;
        }
        .menu-item:hover:not(:disabled) .menu-item-icon {
          transform: scale(1.16);
          filter: drop-shadow(0 0 6px rgba(255,255,255,0.35));
        }
        .menu-item-chevron {
          transition: transform 0.25s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.2s ease;
          opacity: 0;
          transform: translateX(-6px);
        }
        .menu-item:hover:not(:disabled) .menu-item-chevron {
          opacity: 1;
          transform: translateX(0);
        }
      `}</style>

      {/* Backdrop */}
      <div
        className="fixed inset-0 z-[150]"
        style={{
          background: 'rgba(0,0,0,0.6)',
          backdropFilter: 'blur(4px)',
          WebkitBackdropFilter: 'blur(4px)',
          animation: 'backdropFade 0.25s ease forwards',
        }}
        onClick={onClose}
      />

      {/* Menu Container */}
      <div
        ref={menuRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className="fixed left-4 right-4 mx-auto z-[151] rounded-2xl overflow-hidden shadow-2xl md:left-20 md:right-auto md:mx-0"
        style={{
          background: 'linear-gradient(155deg, rgba(20,20,20,0.98), rgba(4,4,4,0.99))',
          border: '1px solid rgba(255,255,255,0.16)',
          minWidth: isMobile ? undefined : 240,
          maxWidth: isMobile ? 'calc(100% - 2rem)' : 360,
          width: isMobile ? 'calc(100% - 2rem)' : undefined,
          top: isMobile ? undefined : '50%',
          bottom: isMobile ? 'max(1rem, env(safe-area-inset-bottom, 0px))' : undefined,
          transformOrigin: isMobile ? 'center bottom' : 'left center',
          animation: 'panelPopIn 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards',
          transform: isMobile
            ? 'none'
            : `perspective(900px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) translateY(-50%)`,
          transition: 'transform 0.15s ease-out',
          boxShadow: `
            0 30px 60px -12px rgba(0,0,0,0.9),
            0 0 0 1px rgba(255,255,255,0.04),
            inset 0 1px 0 rgba(255,255,255,0.08),
            inset 0 0 40px rgba(255,255,255,0.02)
          `,
        }}
      >
        {/* sheen sweep across the top edge */}
        <div
          className="pointer-events-none absolute inset-0 overflow-hidden opacity-40 select-none"
          style={{ mixBlendMode: 'overlay' }}
        >
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '40%',
              height: '100%',
              background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.5), transparent)',
              animation: 'sheen 2.4s ease-in-out infinite',
              animationDelay: '0.6s',
            }}
          />
        </div>

        <div
          className="px-4 py-3 flex items-center justify-between relative"
          style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}
        >
          <p className="text-[11px] font-mono text-white/45 uppercase tracking-wider">
            Export chat
          </p>
          <button
            onClick={onClose}
            className="text-white/30 hover:text-white/80 transition-colors cursor-pointer"
            style={{ transition: 'transform 0.2s ease, color 0.2s ease' }}
            onMouseEnter={(e) => (e.currentTarget.style.transform = 'rotate(90deg)')}
            onMouseLeave={(e) => (e.currentTarget.style.transform = 'rotate(0deg)')}
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="py-1.5 relative">
          {items.map((item, i) => {
            const Icon = item.icon;
            const disabled = !hasMessages;
            return (
              <button
                key={item.key}
                onClick={item.onClick}
                disabled={disabled}
                onMouseEnter={() => setHoveredItem(item.key)}
                onMouseLeave={() => setHoveredItem(null)}
                className="menu-item w-full text-left px-4 py-3 text-[13px] text-white/70 hover:text-white flex items-center gap-3 cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
                style={{
                  fontFamily: 'Inter, sans-serif',
                  animation: `itemSlideIn 0.4s cubic-bezier(0.22, 1, 0.36, 1) forwards`,
                  animationDelay: `${0.15 + i * 0.07}s`,
                  opacity: 0,
                }}
              >
                <span
                  className="menu-item-icon flex items-center justify-center rounded-lg"
                  style={{
                    width: 28,
                    height: 28,
                    background: hoveredItem === item.key ? 'rgba(255,255,255,0.12)' : 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(255,255,255,0.1)',
                  }}
                >
                  <Icon className="w-3.5 h-3.5" style={{ color: item.accentColor }} />
                </span>
                <span className="flex flex-col leading-tight flex-1">
                  <span>{item.label}</span>
                  <span className="text-[10px] text-white/30 font-mono">{item.sub}</span>
                </span>
                <ChevronRight className="menu-item-chevron w-3 h-3 text-white/40" />
              </button>
            );
          })}
        </div>
      </div>
    </>
  );
}

function WhatsAppQuickMenu({ isOpen, onClose }) {
  const [copied, setCopied] = useState(false);

  // Mobile uses a bottom-sheet layout (it sits above the horizontal
  // dock at the bottom of the screen); desktop keeps the left-dock-
  // anchored panel. Tracks the `md` breakpoint (768px) to match Tailwind.
  const [isMobile, setIsMobile] = useState(
    () => typeof window !== 'undefined' && window.matchMedia('(max-width: 767px)').matches
  );
  useEffect(() => {
    const mql = window.matchMedia('(max-width: 767px)');
    const handler = (e) => setIsMobile(e.matches);
    mql.addEventListener('change', handler);
    return () => mql.removeEventListener('change', handler);
  }, []);

  const copyNumber = () => {
    navigator.clipboard.writeText(WHATSAPP_DISPLAY_NUMBER);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const openWhatsApp = () => {
    window.open(`https://wa.me/${WHATSAPP_DIAL_NUMBER}`, '_blank', 'noopener,noreferrer');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <React.Fragment key="wa-menu-root">
          {/* Backdrop */}
          <motion.div
            key="wa-backdrop"
            className="fixed inset-0 z-[150]"
            style={{
              background: 'rgba(0,0,0,0.6)',
              backdropFilter: 'blur(4px)',
              WebkitBackdropFilter: 'blur(4px)',
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            onClick={onClose}
          />

          {/* Menu Container
              Mobile (<768px): bottom sheet — full-width (minus side gutters),
              anchored above the mobile dock, slides up from the bottom.
              Desktop (>=768px): original left-dock-anchored panel,
              vertically centered, fades/scales in place. */}
          <motion.div
            key="wa-panel"
            className="fixed z-[151] rounded-2xl overflow-hidden shadow-2xl left-4 right-4 mx-auto md:left-20 md:right-auto md:mx-0"
            style={{
              background: 'linear-gradient(155deg, rgba(20,20,20,0.98), rgba(4,4,4,0.99))',
              border: '1px solid rgba(255,255,255,0.16)',
              minWidth: isMobile ? undefined : 240,
              maxWidth: isMobile ? 'calc(100% - 2rem)' : 320,
              width: isMobile ? 'calc(100% - 2rem)' : undefined,
              top: isMobile ? undefined : '50%',
              bottom: isMobile ? 'max(1rem, env(safe-area-inset-bottom, 0px))' : undefined,
              boxShadow: `
                0 30px 60px -12px rgba(0,0,0,0.9),
                0 0 0 1px rgba(255,255,255,0.04),
                inset 0 1px 0 rgba(255,255,255,0.08),
                inset 0 0 40px rgba(255,255,255,0.02)
              `,
            }}
            initial={
              isMobile
                ? { opacity: 0, y: 24, scale: 0.96 }
                : { opacity: 0, y: '-50%', scale: 0.9, filter: 'blur(6px)' }
            }
            animate={
              isMobile
                ? { opacity: 1, y: 0, scale: 1 }
                : { opacity: 1, y: '-50%', scale: 1, filter: 'blur(0px)' }
            }
            exit={
              isMobile
                ? { opacity: 0, y: 16, scale: 0.96 }
                : { opacity: 0, y: '-50%', scale: 0.9, filter: 'blur(4px)' }
            }
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* sheen sweep across the top edge */}
            <div
              className="pointer-events-none absolute inset-0 overflow-hidden opacity-40 select-none"
              style={{ mixBlendMode: 'overlay' }}
            >
              <style>{`
                @keyframes waSheen {
                  0% { transform: translateX(-120%) skewX(-20deg); }
                  100% { transform: translateX(220%) skewX(-20deg); }
                }
              `}</style>
              <div
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '40%',
                  height: '100%',
                  background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.5), transparent)',
                  animation: 'waSheen 2.4s ease-in-out infinite',
                  animationDelay: '0.6s',
                }}
              />
            </div>

            <div
              className="px-4 py-3 flex items-center justify-between relative"
              style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}
            >
              <p className="text-[11px] font-mono text-white/45 uppercase tracking-wider">
                Chat on WhatsApp
              </p>
              <button
                onClick={onClose}
                className="text-white/30 hover:text-white/80 transition-colors cursor-pointer p-1 -m-1"
                style={{ transition: 'transform 0.2s ease, color 0.2s ease' }}
                onMouseEnter={(e) => (e.currentTarget.style.transform = 'rotate(90deg)')}
                onMouseLeave={(e) => (e.currentTarget.style.transform = 'rotate(0deg)')}
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="px-4 pt-4 pb-2 relative">
              <p
                className="text-[13px] text-white/60 leading-relaxed mb-3.5"
                style={{ fontFamily: 'Inter, sans-serif' }}
              >
                Pyrobot runs on WhatsApp too — same duality engine, no app to open. Text this number to start:
              </p>

              <div
                className="flex items-center justify-between gap-3 px-3.5 py-3 rounded-xl mb-3"
                style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <span
                    className="flex items-center justify-center rounded-lg shrink-0"
                    style={{ width: 30, height: 30, background: 'rgba(34,255,136,0.1)', border: '1px solid rgba(34,255,136,0.25)' }}
                  >
                    <Smartphone className="w-3.5 h-3.5" style={{ color: GREEN }} />
                  </span>
                  <span
                    className="text-[14px] font-semibold text-white/90 tabular-nums truncate"
                    style={{ fontFamily: 'Space Grotesk, sans-serif', letterSpacing: '-0.01em' }}
                  >
                    {WHATSAPP_DISPLAY_NUMBER}
                  </span>
                </div>
                <button
                  onClick={copyNumber}
                  title="Copy number"
                  className="shrink-0 w-8 h-8 md:w-7 md:h-7 rounded-lg flex items-center justify-center text-white/40 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                >
                  {copied ? <Check className="w-3.5 h-3.5" style={{ color: GREEN }} /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

            <div className="px-4 pb-4 relative" style={{ paddingBottom: 'max(1rem, env(safe-area-inset-bottom, 0px))' }}>
              <button
                onClick={openWhatsApp}
                className="w-full flex items-center justify-center gap-2 py-3 md:py-2.5 rounded-xl text-[13px] font-semibold cursor-pointer transition-transform active:scale-[0.98]"
                style={{
                  fontFamily: 'Inter, sans-serif',
                  background: `linear-gradient(155deg, ${GREEN}, ${GREEN_DIM})`,
                  color: '#04140a',
                  boxShadow: '0 4px 16px rgba(34,255,136,0.3)',
                }}
              >
                Open in WhatsApp
                <ExternalLink className="w-3.5 h-3.5" />
              </button>
            </div>
          </motion.div>
        </React.Fragment>
      )}
    </AnimatePresence>
  );
}





/* ════════════════════════════════════════════════════════════════
   11. CONVERSATION PAGE — main export
════════════════════════════════════════════════════════════════ */
export default function ConversationPage() {
  const navigate = useNavigate();
  const chatEndRef = useRef(null);
  const [messages, setMessages] = useState([]);
  const [inputVal, setInputVal] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const [transitioning, setTransitioning] = useState(false); // true while welcome→chat morph plays
  const [activeMode, setActiveMode] = useState('Duality');
  const [activeProvider, setActiveProvider] = useState('groq');
  const [dualityRatio, setDualityRatio] = useState(50); // 0-100, logic%
  const [showHistoryDrawer, setShowHistoryDrawer] = useState(false);
  const [showInsights, setShowInsights] = useState(false);
  const [showExportMenu, setShowExportMenu] = useState(false);
  const [showWhatsAppMenu, setShowWhatsAppMenu] = useState(false);
  const [safeDemoMode, setSafeDemoMode] = useState(false);

  // Starred messages — persisted to localStorage
  const [starredMessages, setStarredMessages] = useState(() => {
    try {
      const saved = localStorage.getItem('mindbot_starred');
      return saved ? JSON.parse(saved) : [];
    } catch { return []; }
  });

  const persistStarred = useCallback((updated) => {
    setStarredMessages(updated);
    try { localStorage.setItem('mindbot_starred', JSON.stringify(updated)); } catch { }
  }, []);

  const handleStar = useCallback((msg) => {
    setStarredMessages(prev => {
      const exists = prev.find(m => m.id === msg.id);
      const updated = exists ? prev.filter(m => m.id !== msg.id) : [msg, ...prev];
      try { localStorage.setItem('mindbot_starred', JSON.stringify(updated)); } catch { }
      return updated;
    });
  }, []);

  const handleUnstar = useCallback((msgId) => {
    setStarredMessages(prev => {
      const updated = prev.filter(m => m.id !== msgId);
      try { localStorage.setItem('mindbot_starred', JSON.stringify(updated)); } catch { }
      return updated;
    });
  }, []);

  // Export chat — markdown download
  const exportAsMarkdown = useCallback(() => {
    if (!messages.length) return;
    const lines = [];
    lines.push(`# Pyrobot Chat Export`);
    lines.push(`> Session: ${new Date().toLocaleString()}`);
    lines.push(`> Mode: ${activeMode} | Provider: ${activeProvider}`);
    lines.push('');
    messages.forEach(msg => {
      if (msg.sender === 'user') {
        lines.push(`## 🧑 You — ${msg.time || ''}`);
        lines.push(msg.text || '');
        lines.push('');
      } else if (msg.sender === 'synaptica') {
        lines.push(`## 🤖 SYNAPTICA — ${msg.time || ''}`);
        if (msg.modeName) lines.push(`*Mode: ${msg.modeName}*`);
        lines.push('');
        lines.push(msg.text || '');
        if (msg.aiReasoning) {
          lines.push('');
          lines.push(`> **⚡ AI Reasoning:** ${msg.aiReasoning}`);
        }
        if (msg.humanInsight) {
          lines.push(`> **🫀 Human Insight:** ${msg.humanInsight}`);
        }
        lines.push('');
        lines.push('---');
        lines.push('');
      }
    });
    const blob = new Blob([lines.join('\n')], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Pyrobot-chat-${Date.now()}.md`;
    a.click();
    URL.revokeObjectURL(url);
  }, [messages, activeMode, activeProvider]);

  // Export chat — print / PDF
  const exportAsPDF = useCallback(() => {
    if (!messages.length) return;
    const content = messages.map(msg => {
      if (msg.sender === 'user') {
        return `<div style="margin:18px 0"><strong style="color:#888">You</strong><br/><p style="margin:6px 0">${(msg.text || '').replace(/\n/g, '<br/>')}</p></div>`;
      }
      return `<div style="margin:18px 0;padding:14px;background:#0a0a12;border-radius:10px;border:1px solid #222">
        <strong style="color:#a78bfa">SYNAPTICA</strong> <small style="color:#555">${msg.modeName || ''}</small><br/>
        <p style="margin:8px 0;color:#ddd">${(msg.text || '').replace(/```[\s\S]*?```/g, '[code block]').replace(/\n/g, '<br/>')}</p>
        ${msg.aiReasoning ? `<p style="margin:6px 0;color:#888;font-size:12px">⚡ ${msg.aiReasoning}</p>` : ''}
        ${msg.humanInsight ? `<p style="margin:6px 0;color:#888;font-size:12px">🫀 ${msg.humanInsight}</p>` : ''}
      </div>`;
    }).join('');
    const win = window.open('', '_blank');
    if (!win) return;
    win.document.write(`<!DOCTYPE html><html><head><title>Pyrobot Export</title><style>
      body{background:#030304;color:#e5e5e5;font-family:Inter,sans-serif;max-width:760px;margin:40px auto;padding:0 24px;font-size:14px;line-height:1.7}
      @media print{body{background:#fff;color:#111}}
    </style></head><body>
      <h1 style="color:#a78bfa;font-size:20px;margin-bottom:4px">Pyrobot – Chat Export</h1>
      <p style="color:#555;font-size:12px;margin-bottom:28px">${new Date().toLocaleString()} · ${activeMode} · ${activeProvider}</p>
      ${content}
    </body></html>`);
    win.document.close();
    setTimeout(() => win.print(), 400);
  }, [messages, activeMode, activeProvider]);

  const inputWrapRef = useRef(null);

  useEffect(() => {
    if (!inputWrapRef.current) return;
    const observer = new ResizeObserver(([entry]) => {
      document.documentElement.style.setProperty('--input-height', `${entry.contentRect.height}px`);
    });
    observer.observe(inputWrapRef.current);
    return () => observer.disconnect();
  }, []);

  // Persistent session storage
  const [sessions, setSessions] = useState(() => {
    try {
      const saved = localStorage.getItem('mindbot_saved_sessions');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [currentSessionId, setCurrentSessionId] = useState(() => 'session_' + Date.now());

  // Auto-save current session to history whenever messages update
  useEffect(() => {
    if (messages.length === 0) return;

    const firstUserMsg = messages.find(m => m.sender === 'user');
    const titleText = firstUserMsg ? firstUserMsg.text.slice(0, 45) : 'New Conversation';
    const title = titleText.length >= 45 ? titleText + '...' : titleText;

    const sessionData = {
      id: currentSessionId,
      title,
      timestamp: new Date().toISOString(),
      dateFormatted: new Date().toLocaleString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }),
      messages,
      activeMode,
      activeProvider,
    };

    setSessions(prev => {
      const existingIndex = prev.findIndex(s => s.id === currentSessionId);
      let updated;
      if (existingIndex >= 0) {
        updated = [...prev];
        updated[existingIndex] = sessionData;
      } else {
        updated = [sessionData, ...prev];
      }
      try {
        localStorage.setItem('mindbot_saved_sessions', JSON.stringify(updated));
      } catch (e) {
        console.warn('Failed to save session to localStorage:', e);
      }
      return updated;
    });
  }, [messages, currentSessionId, activeMode, activeProvider]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const loadSession = (session) => {
    setCurrentSessionId(session.id);
    setMessages(session.messages || []);
    setHasStarted(true);
    if (session.activeMode) setActiveMode(session.activeMode);
    if (session.activeProvider) setActiveProvider(session.activeProvider);
  };

  const deleteSession = (sessionId) => {
    setSessions(prev => {
      const updated = prev.filter(s => s.id !== sessionId);
      try {
        localStorage.setItem('mindbot_saved_sessions', JSON.stringify(updated));
      } catch { }
      return updated;
    });
    if (currentSessionId === sessionId) {
      resetSession();
    }
  };

  const clearAllSessions = () => {
    if (window.confirm('Are you sure you want to clear all conversation history?')) {
      setSessions([]);
      try {
        localStorage.removeItem('mindbot_saved_sessions');
      } catch { }
      resetSession();
    }
  };

  const resetSession = () => {
    setCurrentSessionId('session_' + Date.now());
    setMessages([]);
    setHasStarted(false);
  };

  const sendMessage = async (text, attachments = []) => {
    const rawText = (text || inputVal).trim();
    if (!rawText && (!attachments || attachments.length === 0)) return;
    setInputVal('');

    // Instantly transition to chat mode
    if (!hasStarted) {
      setHasStarted(true);
    }

    const startTime = Date.now();

    // Perform Sentiment Analysis on User Input
    const sentiment = analyzeSentiment(rawText);

    // Auto-adapt Duality Ratio based on detected tone
    let effectiveRatio = dualityRatio;
    if (sentiment.toneShift === 'empathy') {
      effectiveRatio = Math.max(15, Math.min(30, dualityRatio - 35));
    } else if (sentiment.toneShift === 'logic') {
      effectiveRatio = Math.min(85, Math.max(70, dualityRatio + 35));
    }

    // Format prompt text for Gemini/Grok if attachments exist
    let promptForAI = rawText;
    if (attachments && attachments.length > 0) {
      const attNames = attachments.map(a => `${a.name} (${a.size})`).join(', ');
      promptForAI = rawText
        ? `${rawText}\n\n[Attached File(s): ${attNames}]`
        : `[Attached File(s): ${attNames}] Please analyze these files.`;
    }

    // Build user message with sentiment badge metadata
    const userMsgObj = {
      id: Date.now(),
      sender: 'user',
      text: rawText,
      sentiment: sentiment,
      attachments: attachments,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages(prev => [...prev, userMsgObj]);
    setIsTyping(true);

    try {
      const providerToUse = safeDemoMode ? 'openrouter' : activeProvider;
      const response = await getSynthesizedResponse(promptForAI, messages, activeMode, providerToUse, undefined, effectiveRatio, { safeDemoMode });

      setIsTyping(false);
      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        sender: 'synaptica',
        text: response.text,
        aiReasoning: response.aiReasoning,
        humanInsight: response.humanInsight,
        logicRatio: response.logicRatio,
        empathyRatio: response.empathyRatio,
        modeName: response.modeName || activeMode,
        provider: response.provider || providerToUse,
        modelUsed: response.modelUsed,
        isFallback: Boolean(response.isFallback),
        thinkingMs: Date.now() - startTime,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      }]);
    } catch (err) {
      console.error('[MindBot] Send error:', err);
      setIsTyping(false);

      // Determine a helpful error message based on the error type
      const isAuthError = err?.message?.includes('401') || err?.message?.includes('403') || err?.message?.includes('API_KEY') || err?.message?.includes('INVALID_ARGUMENT') || err?.message?.includes('API key');
      const providerLabel = activeProvider === 'groq' ? 'Groq' : activeProvider === 'openrouter' ? 'OpenRouter' : activeProvider === 'grok' ? 'Grok (xAI)' : 'Gemini';
      const envKey = activeProvider === 'groq' ? 'VITE_GROQ_API_KEY' : activeProvider === 'openrouter' ? 'VITE_OPENROUTER_API_KEY' : activeProvider === 'grok' ? 'VITE_GROK_API_KEY' : 'VITE_GEMINI_API_KEY';

      if (isAuthError) {
        setMessages(prev => [...prev, {
          id: Date.now() + 1,
          sender: 'synaptica',
          text: `⚠️ API key error — the ${providerLabel} API key in your .env file appears invalid or missing. Please add a valid \`${envKey}\` and restart the dev server.`,
          provider: activeProvider,
          isError: true,
          thinkingMs: Date.now() - startTime,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        }]);
        return;
      }

      const fallback = generateSmartResponse(promptForAI, [...messages, userMsgObj]);
      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        sender: 'synaptica',
        text: fallback.text,
        aiReasoning: fallback.aiReasoning,
        humanInsight: fallback.humanInsight,
        logicRatio: 55,
        empathyRatio: 45,
        modeName: 'Safe Fallback',
        provider: 'fallback',
        modelUsed: 'local-context-engine',
        isFallback: true,
        thinkingMs: Date.now() - startTime,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      }]);
    }
  };

  // Replaces a specific AI message with a fresh AI response to the same prompt
  const regenerateMessage = async (aiMsgId, userPrompt, historyBeforeMsg) => {
    if (isTyping) return;

    // Remove the old AI message and show typing indicator
    setMessages(prev => prev.filter(m => m.id !== aiMsgId));
    setIsTyping(true);

    const startTime = Date.now();
    try {
      const providerToUse = safeDemoMode ? 'openrouter' : activeProvider;
      const response = await getSynthesizedResponse(userPrompt, historyBeforeMsg, activeMode, providerToUse, undefined, dualityRatio, { safeDemoMode });
      const elapsed = Date.now() - startTime;
      if (elapsed < 1200) await new Promise(r => setTimeout(r, 1200 - elapsed));

      setIsTyping(false);
      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        sender: 'synaptica',
        text: response.text,
        aiReasoning: response.aiReasoning,
        humanInsight: response.humanInsight,
        logicRatio: response.logicRatio,
        empathyRatio: response.empathyRatio,
        modeName: response.modeName || activeMode,
        provider: response.provider || providerToUse,
        modelUsed: response.modelUsed,
        isFallback: Boolean(response.isFallback),
        thinkingMs: Date.now() - startTime,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      }]);
    } catch (err) {
      console.error('[MindBot] Regenerate error:', err);
      setIsTyping(false);
      const isAuthError = err?.message?.includes('401') || err?.message?.includes('403') || err?.message?.includes('API key') || err?.message?.includes('INVALID_ARGUMENT');
      const envKey = activeProvider === 'groq' ? 'VITE_GROQ_API_KEY' : activeProvider === 'openrouter' ? 'VITE_OPENROUTER_API_KEY' : activeProvider === 'grok' ? 'VITE_GROK_API_KEY' : 'VITE_GEMINI_API_KEY';
      if (isAuthError) {
        setMessages(prev => [...prev, {
          id: Date.now() + 1,
          sender: 'synaptica',
          text: `⚠️ API key error — please check your \`${envKey}\` in .env.`,
          provider: activeProvider,
          isError: true,
          thinkingMs: Date.now() - startTime,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        }]);
        return;
      }

      const fallback = generateSmartResponse(userPrompt, historyBeforeMsg);
      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        sender: 'synaptica',
        text: fallback.text,
        aiReasoning: fallback.aiReasoning,
        humanInsight: fallback.humanInsight,
        logicRatio: 55,
        empathyRatio: 45,
        modeName: 'Safe Fallback',
        provider: 'fallback',
        modelUsed: 'local-context-engine',
        isFallback: true,
        thinkingMs: Date.now() - startTime,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      }]);
    }
  };

  /* ── Transition CSS injected once ── */
  const transitionCSS = `
    @keyframes cp-blur-up {
      from { opacity: 1; transform: translateY(0) scale(1); filter: blur(0); }
      to   { opacity: 0; transform: translateY(-32px) scale(0.96); filter: blur(6px); }
    }
    .cp-exit-logo  { animation: cp-blur-up 0.38s cubic-bezier(0.4,0,0.2,1) forwards; animation-delay: 0s; }
    .cp-exit-title { animation: cp-blur-up 0.38s cubic-bezier(0.4,0,0.2,1) forwards; animation-delay: 0.06s; }
    .cp-exit-input  { animation: cp-blur-up 0.32s cubic-bezier(0.4,0,0.2,1) forwards; animation-delay: 0.12s; }
    .cp-exit-extras { animation: cp-blur-up 0.28s cubic-bezier(0.4,0,0.2,1) forwards; animation-delay: 0.16s; }
    @media (prefers-reduced-motion: reduce) {
      .cp-exit-logo, .cp-exit-title, .cp-exit-input, .cp-exit-extras { animation: none; opacity: 0; }
    }
  `;

  return (
    <div className="relative flex bg-black" style={{ height: '100dvh', width: '100vw', overflow: 'hidden' }}>
      <style>{transitionCSS}</style>
      <BeamBackground />

      <Sidebar
        onNavigate={action => {
          if (action === 'new') resetSession();
          if (action === 'history') setShowHistoryDrawer(true);
          if (action === 'insights') setShowInsights(true);
          if (action === 'export') {
            // Show export mini-menu (handled inline below)
            setShowExportMenu(v => !v);
          }
          if (action === 'whatsapp') {
            setShowWhatsAppMenu(v => !v);
          }
        }}
        hasStarted={hasStarted}
        messages={messages}
      />

      <HistoryDrawer
        isOpen={showHistoryDrawer}
        onClose={() => setShowHistoryDrawer(false)}
        sessions={sessions}
        onLoadSession={loadSession}
        onDeleteSession={deleteSession}
        onClearAll={clearAllSessions}
        starredMessages={starredMessages}
        onUnstar={handleUnstar}
      />

      <InsightsPanel
        isOpen={showInsights}
        onClose={() => setShowInsights(false)}
        messages={messages}
      />

      <ExportQuickMenu
        isOpen={showExportMenu}
        onClose={() => setShowExportMenu(false)}
        onExportMarkdown={exportAsMarkdown}
        onExportPDF={exportAsPDF}
        hasMessages={messages.length > 0}
      />

      <WhatsAppQuickMenu
        isOpen={showWhatsAppMenu}
        onClose={() => setShowWhatsAppMenu(false)}
      />




      <main className="relative z-10 flex-1 flex flex-col overflow-hidden">
        <AnimatePresence mode="wait">
          {/* ── WELCOME SCREEN ── */}
          {!hasStarted ? (
            <motion.div
              key="welcome"
              initial={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, y: -16, scale: 0.98 }}
              transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
              className="flex-1 flex flex-col items-center justify-center px-4 sm:px-6 pb-20 sm:pb-12"
            >
              {/* Logo */}
              <motion.div
                initial={{ opacity: 0, scale: 0.75 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.05, duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                className="mb-5 sm:mb-7"
              >
                <LogoMark size={36} />
              </motion.div>

              {/* Headline */}
              <motion.h1
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1, duration: 0.4 }}
                className="text-3xl sm:text-4xl lg:text-5xl font-light text-white text-center mb-7 sm:mb-10 px-2"
                style={{ letterSpacing: '-0.03em', lineHeight: 1.1 }}
              >
                What can I help you<br /><span style={{ opacity: 0.45 }}>explore today?</span>
              </motion.h1>

              {/* Input Box */}
              <motion.div
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15, duration: 0.4 }}
                className="w-full max-w-2xl mb-5 px-1 sm:px-0"
              >
                <InputBox
                  value={inputVal} onChange={setInputVal}
                  onSend={sendMessage} large
                  activeMode={activeMode} onModeChange={setActiveMode}
                  activeProvider={activeProvider} onProviderChange={setActiveProvider}
                />
              </motion.div>

              {/* Duality Slider + Suggestion Chips */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.4 }}
                className="w-full max-w-2xl space-y-5 px-1 sm:px-0"
              >
                {/* Duality ratio slider container with Model Selector above it */}
                <div
                  className="p-3.5 sm:p-4 rounded-2xl space-y-3.5 relative z-30 overflow-visible"
                  style={{
                    background: 'rgba(255,255,255,0.03)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    backdropFilter: 'blur(12px)',
                  }}
                >
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 pb-3">
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] sm:text-xs font-mono font-semibold text-white/50 uppercase tracking-wider">
                        AI Model:
                      </span>
                      <ModelSelector
                        activeProvider={activeProvider}
                        onProviderChange={setActiveProvider}
                        isDropUp={false}
                      />
                    </div>
                    <button
                      onClick={() => setDualityRatio(50)}
                      className="text-[10px] text-white/40 hover:text-white font-mono px-2 py-1 rounded-lg bg-white/5 border border-white/10 transition-colors cursor-pointer"
                    >
                      Reset 
                    </button>
                  </div>


                  <DualitySlider
                    value={dualityRatio}
                    onChange={setDualityRatio}
                    disabled={false}
                  />
                </div>

                <div className="relative z-10">
                  
                  <SuggestionChips
                    onSelect={(text) => {
                      setInputVal(text);
                    }}
                    count={6}
                  />
                </div>
              </motion.div>
            </motion.div>
          ) : (
            /* ── ACTIVE CONVERSATION ── */
            <motion.div
              key="chat"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="flex-1 flex flex-col overflow-hidden"
            >

              <div className="relative flex-1 min-h-0">
                <div
                  className="h-full overflow-y-auto messages-scroll-container pt-16 sm:pt-10"
                >
                  <div
                    className="max-w-3xl mx-auto space-y-8 px-3 sm:px-16 lg:px-6"
                    style={{ paddingBottom: 'calc(var(--input-height, 140px) + 2rem)' }}
                  >
                    {messages.map((msg, idx) => {
                      if (msg.sender === 'user') return <UserMessage key={msg.id} msg={msg} />;
                      const prevUserMsg = [...messages].slice(0, idx).reverse().find(m => m.sender === 'user');
                      const handleRegenerate = prevUserMsg
                        ? () => regenerateMessage(msg.id, prevUserMsg.text, messages.slice(0, idx))
                        : undefined;
                      const isStarred = starredMessages.some(s => s.id === msg.id);
                      return <AIMessage key={msg.id} msg={msg} thinkingMs={msg.thinkingMs} onRegenerate={handleRegenerate} isStarred={isStarred} onStar={handleStar} />;
                    })}
                    {isTyping && <TypingIndicator sentiment={messages.find(m => m.sender === 'user' && m.id === messages[messages.length - 1]?.id)?.sentiment} />}
                    <div ref={chatEndRef} />
                  </div>
                </div>

                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-x-0 bottom-0 z-10"
                  style={{
                    height: '12rem',
                    backdropFilter: 'blur(20px)',
                    WebkitBackdropFilter: 'blur(20px)',
                    maskImage: 'linear-gradient(to bottom, transparent 0%, black 55%, black 100%)',
                    WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, black 55%, black 100%)',
                  }}
                />

                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-x-0 bottom-0 z-10"
                  style={{
                    height: '12rem',
                    background: `linear-gradient(to bottom, transparent 0%, ${PAGE_BG} 45%, ${PAGE_BG} 100%)`,
                  }}
                />
              </div>


              <div
                className="absolute bottom-0 left-0 right-0 h-44 pointer-events-none z-10 select-none"
                style={{
                  background: 'linear-gradient(to top, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.85) 50%, rgba(0,0,0,0) 100%)',
                  backdropFilter: 'blur(4px)',
                  WebkitBackdropFilter: 'blur(4px)',
                }}
              />

              <motion.div
                ref={inputWrapRef}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15, duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                className="absolute bottom-0 left-0 right-0 flex flex-col items-center px-3 sm:px-4 pt-2 pointer-events-none z-20 input-safe-area chat-has-dock  translate-y-4 sm:translate-y-0"
              >
                <div className="w-full max-w-2xl pointer-events-auto">
                  <InputBox
                    value={inputVal} onChange={setInputVal}
                    onSend={sendMessage}
                    activeMode={activeMode} onModeChange={setActiveMode}
                    activeProvider={activeProvider} onProviderChange={setActiveProvider}
                  />
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}