import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  Plus, Bookmark, Compass, LayoutGrid,
  MoreHorizontal, Mic, Settings2, MessageSquare,
  ChevronDown, Sparkles, Brain, Cpu, Zap, Globe,
  Copy, Check, Paperclip, RefreshCw,
  Share2, ThumbsUp, ThumbsDown, Code,
  Download, Clock, X, FileText, Image as ImageIcon, File,
  Trash2, Search,
} from 'lucide-react';
import { FloatingDock } from './ui/floating-dock';
import AITextLoading from './ui/ai-text-loading';
import FloatingActionButton from './ui/floating-action-button';
import { getSynthesizedResponse } from '../services/aiProvider';

import PremiumDualityMeter from "./DualityMeter";
import UserMessage from "./UserMessage";
import HistoryDrawer from "./HistoryDrawer";

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
function Sidebar({ onNavigate, hasStarted = false }) {
  const navigate = useNavigate();
  const dockItems = [
    { title: 'New Session', icon: <Plus className="h-full w-full" />, onClick: () => onNavigate('new') },
    { title: 'History', icon: <Bookmark className="h-full w-full" />, onClick: () => onNavigate('history') },
    { title: 'Landing Page', icon: <Compass className="h-full w-full" />, onClick: () => navigate('/landing') },
    { title: 'All Tools', icon: <LayoutGrid className="h-full w-full" />, onClick: () => { } },
    { title: 'More', icon: <MoreHorizontal className="h-full w-full" />, onClick: () => { } },
  ];

  return (
    <>
      {/* Desktop / Tablet — vertical dock floating on the left */}
      <div className="desktop-sidebar fixed left-4 top-1/2 -translate-y-1/2 z-50">
        <FloatingDock items={dockItems} orientation="vertical" />
      </div>

      {/* Mobile — horizontal floating glass capsule dock at bottom center */}
      <div
        className={`mobile-sidebar fixed left-1/2 -translate-x-1/2 z-40 transition-all duration-300 md:hidden ${hasStarted
          ? 'bottom-[calc(env(safe-area-inset-bottom,0px)+86px)]'
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

function formatFileSize(bytes) {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
}

function InputBox({ value, onChange, onSend, placeholder, large = false, activeMode, onModeChange, activeProvider = 'gemini', onProviderChange, dropUp }) {
  const [attachments, setAttachments] = useState([]);
  const [isListening, setIsListening] = useState(false);
  const [showModeDropdown, setShowModeDropdown] = useState(false);
  const [showProviderDropdown, setShowProviderDropdown] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [justSent, setJustSent] = useState(false);
  const dragCounter = useRef(0);
  const fileInputRef = useRef(null);
  const textareaRef = useRef(null);
  const modeDropdownRef = useRef(null);
  const providerDropdownRef = useRef(null);

  // If dropUp is specified use it, otherwise open downward when large (welcome screen) and upward when small (active chat)
  const isDropUp = dropUp !== undefined ? dropUp : !large;

  // Close mode and provider dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (modeDropdownRef.current && !modeDropdownRef.current.contains(e.target)) {
        setShowModeDropdown(false);
      }
      if (providerDropdownRef.current && !providerDropdownRef.current.contains(e.target)) {
        setShowProviderDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);


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

  const handleVoiceDictation = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Voice dictation is not supported in this browser.");
      return;
    }

    if (isListening) {
      setIsListening(false);
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);
    recognition.onerror = () => setIsListening(false);

    recognition.onresult = (e) => {
      const transcript = Array.from(e.results)
        .map(result => result[0].transcript)
        .join('');
      onChange(transcript);
    };

    recognition.start();
  };

  const handleSend = () => {
    if (!value.trim() && !attachments.length) return;
    onSend(value, attachments);
    setAttachments([]);
    setJustSent(true);
    setTimeout(() => setJustSent(false), 900);
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
        @keyframes ib-wave {
          0%, 100% { transform: scaleY(0.35); }
          50% { transform: scaleY(1); }
        }
        .ib-bar { animation: ib-wave 0.9s ease-in-out infinite; transform-origin: center; }
        @keyframes ib-send-pulse {
          0% { box-shadow: 0 0 0 0 rgba(255,255,255,0.35); }
          70% { box-shadow: 0 0 0 10px rgba(255,255,255,0); }
          100% { box-shadow: 0 0 0 0 rgba(255,255,255,0); }
        }
        .ib-send-pulse { animation: ib-send-pulse 1.4s ease-out 1; }
        @media (prefers-reduced-motion: reduce) {
          .ib-bar { animation: none; }
          .ib-send-pulse { animation: none; }
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
            <span className="text-[11px] text-red-300/90 font-medium" style={{ fontFamily: 'Inter, sans-serif' }}>
              Listening…
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex flex-wrap items-center justify-between px-3 sm:px-4 pb-3.5 pt-1 gap-2">
        <div className="flex items-center gap-2">
          {/* AI Engine Provider Selector Dropdown */}
          <div className="relative" ref={providerDropdownRef}>
            <button
              onClick={() => {
                setShowProviderDropdown(v => !v);
                setShowModeDropdown(false);
              }}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-medium text-white/90 hover:text-white transition-all cursor-pointer select-none"
              style={{
                background: 'rgba(255, 255, 255, 0.06)',
                border: showProviderDropdown ? '1px solid rgba(255, 255, 255, 0.28)' : '1px solid rgba(255, 255, 255, 0.12)',
                backdropFilter: 'blur(12px)',
              }}
              title="Select AI Engine"
            >
              {activeProvider === 'openrouter' ? <Globe className="w-3.5 h-3.5 text-emerald-400" /> : activeProvider === 'groq' ? <Zap className="w-3.5 h-3.5 text-orange-400" /> : <Sparkles className="w-3.5 h-3.5 text-sky-400" />}

              <span style={{ fontFamily: 'Space Grotesk, sans-serif', letterSpacing: '-0.01em' }}>
                {activeProvider === 'openrouter' ? 'OpenRouter' : activeProvider === 'groq' ? 'Groq (Llama 3.3)' : 'Gemini 2.0'}
              </span>

              <ChevronDown className={`w-3 h-3 text-white/50 transition-transform duration-200 ${showProviderDropdown ? 'rotate-180' : ''}`} />
            </button>

            {/* Provider Dropdown Menu */}
            <AnimatePresence>
              {showProviderDropdown && (
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
                  {[
                    {
                      id: 'gemini',
                      title: 'Gemini 2.0 Flash',
                      desc: 'Fast, high precision multimodal intelligence',
                      icon: <Sparkles className="w-4 h-4 text-sky-400 shrink-0" />,
                    },
                    {
                      id: 'groq',
                      title: 'Groq (Llama 3.3 70B)',
                      desc: 'Ultra-fast synthesis powered by Groq Llama 3.3',
                      icon: <Zap className="w-4 h-4 text-orange-400 shrink-0" />,
                    },
                    {
                      id: 'openrouter',
                      title: 'OpenRouter (Gemma 4 31B)',
                      desc: 'Google Gemma 4 31B & 200+ models via OpenRouter',
                      icon: <Globe className="w-4 h-4 text-emerald-400 shrink-0" />,
                    },
                  ].map(item => {
                    const isActive = activeProvider === item.id;
                    return (
                      <button
                        key={item.id}
                        onClick={() => {
                          if (onProviderChange) onProviderChange(item.id);
                          setShowProviderDropdown(false);
                        }}
                        className="w-full text-left p-2.5 rounded-xl flex items-start gap-2.5 transition-all cursor-pointer group relative mb-0.5"
                        style={{
                          background: isActive ? 'rgba(255, 255, 255, 0.10)' : 'transparent',
                          border: isActive ? '1px solid rgba(255, 255, 255, 0.20)' : '1px solid transparent',
                        }}
                        onMouseEnter={e => {
                          if (!isActive) e.currentTarget.style.background = 'rgba(255, 255, 255, 0.06)';
                        }}
                        onMouseLeave={e => {
                          if (!isActive) e.currentTarget.style.background = 'transparent';
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

          {/* Duality Mode Selector Dropdown — Animated Glass */}
          <div className="relative" ref={modeDropdownRef}>
            <motion.button
              onClick={() => {
                setShowModeDropdown(v => !v);
                setShowProviderDropdown(false);
              }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-medium text-white/90 hover:text-white transition-all cursor-pointer select-none"
              style={{
                background: 'rgba(255, 255, 255, 0.06)',
                border: showModeDropdown ? '1px solid rgba(255, 255, 255, 0.28)' : '1px solid rgba(255, 255, 255, 0.12)',
                backdropFilter: 'blur(12px)',
              }}
              title="Choose Duality Mode"
            >
              {activeMode === 'Logic' && <Cpu className="w-3.5 h-3.5 text-white/90" />}
              {activeMode === 'Duality' && <Sparkles className="w-3.5 h-3.5 text-white/90" />}
              {activeMode === 'Empathy' && <Brain className="w-3.5 h-3.5 text-white/90" />}
              <span style={{ fontFamily: 'Space Grotesk, sans-serif', letterSpacing: '-0.01em' }}>
                {activeMode}
              </span>
              <motion.span
                animate={{ rotate: showModeDropdown ? 180 : 0 }}
                transition={{ duration: 0.4, ease: 'easeInOut', type: 'spring' }}
              >
                <ChevronDown className="w-3 h-3 text-white/50" />
              </motion.span>
            </motion.button>

            {/* Animated Mode Dropdown Menu */}
            <AnimatePresence>
              {showModeDropdown && (
                <motion.div
                  initial={{ y: isDropUp ? 6 : -6, scale: 0.95, opacity: 0, filter: 'blur(8px)' }}
                  animate={{ y: 0, scale: 1, opacity: 1, filter: 'blur(0px)' }}
                  exit={{ y: isDropUp ? 4 : -4, scale: 0.95, opacity: 0, filter: 'blur(8px)' }}
                  transition={{ duration: 0.5, ease: 'circInOut', type: 'spring' }}
                  className={`absolute ${isDropUp ? 'bottom-full mb-2.5' : 'top-full mt-2.5'} left-0 z-[150] w-64 p-1.5 rounded-2xl overflow-hidden shadow-2xl`}
                  style={{
                    background: 'rgba(5, 5, 8, 0.96)',
                    border: '1px solid rgba(255, 255, 255, 0.16)',
                    backdropFilter: 'blur(24px)',
                    WebkitBackdropFilter: 'blur(24px)',
                    boxShadow: '0 12px 40px rgba(0, 0, 0, 0.9), inset 0 1px 0 rgba(255, 255, 255, 0.08)',
                  }}
                >
                  {[
                    {
                      id: 'Logic',
                      title: 'Logic',
                      desc: 'Analytical data, code, facts & formulas',
                      icon: <Cpu className="w-4 h-4 text-white/90 shrink-0" />,
                    },
                    {
                      id: 'Duality',
                      title: 'Duality',
                      desc: '50/50 Machine logic & Human empathy',
                      icon: <Sparkles className="w-4 h-4 text-white/90 shrink-0" />,
                    },
                    {
                      id: 'Empathy',
                      title: 'Empathy',
                      desc: 'Emotional intelligence & context',
                      icon: <Brain className="w-4 h-4 text-white/90 shrink-0" />,
                    },
                  ].map((item, index) => {
                    const isActive = activeMode === item.id;
                    return (
                      <motion.button
                        key={item.id}
                        initial={{ opacity: 0, x: 10, scale: 0.95, filter: 'blur(8px)' }}
                        animate={{ opacity: 1, x: 0, scale: 1, filter: 'blur(0px)' }}
                        exit={{ opacity: 0, x: 8, scale: 0.95, filter: 'blur(8px)' }}
                        transition={{ duration: 0.35, delay: index * 0.07, ease: 'easeOut', type: 'spring' }}
                        whileHover={{ backgroundColor: 'rgba(255,255,255,0.07)' }}
                        whileTap={{ scale: 0.97 }}
                        onClick={() => {
                          onModeChange(item.id);
                          setShowModeDropdown(false);
                        }}
                        className="w-full text-left p-2.5 rounded-xl flex items-start gap-2.5 cursor-pointer group relative mb-0.5"
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
                              <motion.div
                                layoutId="mode-active-dot"
                                className="w-1.5 h-1.5 rounded-full bg-white"
                                style={{ boxShadow: '0 0 8px #ffffff' }}
                              />
                            )}
                          </div>
                          <p className="text-[11px] text-white/40 group-hover:text-white/65 leading-tight mt-0.5" style={{ fontFamily: 'Inter, sans-serif' }}>
                            {item.desc}
                          </p>
                        </div>
                      </motion.button>
                    );
                  })}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
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
            whileHover={canSend ? { scale: 1.06 } : {}}
            whileTap={canSend ? { scale: 0.9 } : {}}
            animate={canSend ? { scale: 1 } : { scale: 1 }}
            initial={false}
            className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors cursor-pointer ${justSent ? 'ib-send-pulse' : ''}`}
            style={{
              background: canSend ? '#ffffff' : 'rgba(255,255,255,0.05)',
              border: canSend ? '1px solid #ffffff' : '1px solid rgba(255,255,255,0.08)',
              boxShadow: canSend ? '0 0 12px rgba(255,255,255,0.25)' : 'none',
              opacity: canSend ? 1 : 0.4,
            }}
          >
            <AnimatePresence mode="wait" initial={false}>
              {justSent ? (
                <motion.span
                  key="sent"
                  initial={{ scale: 0.4, opacity: 0, rotate: -45 }}
                  animate={{ scale: 1, opacity: 1, rotate: 0 }}
                  exit={{ scale: 0.4, opacity: 0 }}
                  transition={{ type: 'spring', stiffness: 500, damping: 22 }}
                >
                  <Check className="w-4 h-4 text-black" strokeWidth={2} />
                </motion.span>
              ) : (
                <motion.span
                  key="send"
                  initial={{ scale: 0.6, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.6, opacity: 0 }}
                >
                  <MessageSquare className={`w-4 h-4 ${canSend ? 'text-black' : 'text-white/30'}`} strokeWidth={1.5} />
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
  const [activeProvider, setActiveProvider] = useState('gemini');
  const [showHistoryDrawer, setShowHistoryDrawer] = useState(false);

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

    // Choreographed welcome → chat transition on the FIRST message
    if (!hasStarted) {
      setTransitioning(true);
      // Let the welcome exit animations play (~400ms), then flip to chat
      await new Promise(r => setTimeout(r, 420));
      setHasStarted(true);
      // Small extra breather so chat entrance begins cleanly
      await new Promise(r => setTimeout(r, 80));
      setTransitioning(false);
    }

    const startTime = Date.now();

    // Format prompt text for Gemini/Grok if attachments exist
    let promptForAI = rawText;
    if (attachments && attachments.length > 0) {
      const attNames = attachments.map(a => `${a.name} (${a.size})`).join(', ');
      promptForAI = rawText
        ? `${rawText}\n\n[Attached File(s): ${attNames}]`
        : `[Attached File(s): ${attNames}] Please analyze these files.`;
    }

    setMessages(prev => [...prev, {
      id: Date.now(),
      sender: 'user',
      text: rawText,
      attachments: attachments,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    }]);
    setIsTyping(true);

    try {
      const response = await getSynthesizedResponse(promptForAI, messages, activeMode, activeProvider);

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
        logicRatio: response.logicRatio,
        empathyRatio: response.empathyRatio,
        modeName: response.modeName || activeMode,
        provider: response.provider || activeProvider,
        thinkingMs: Date.now() - startTime,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      }]);
    } catch (err) {
      console.error('[MindBot] Send error:', err);
      const elapsed = Date.now() - startTime;
      if (elapsed < 800) await new Promise(r => setTimeout(r, 800 - elapsed));
      setIsTyping(false);

      // Determine a helpful error message based on the error type
      const isAuthError = err?.message?.includes('401') || err?.message?.includes('403') || err?.message?.includes('API_KEY') || err?.message?.includes('INVALID_ARGUMENT') || err?.message?.includes('API key');
      const providerLabel = activeProvider === 'groq' ? 'Groq' : activeProvider === 'grok' ? 'Grok (xAI)' : 'Gemini';
      const envKey = activeProvider === 'groq' ? 'VITE_GROQ_API_KEY' : activeProvider === 'grok' ? 'VITE_GROK_API_KEY' : 'VITE_GEMINI_API_KEY';

      const errorText = isAuthError
        ? `⚠️ API key error — the ${providerLabel} API key in your .env file appears invalid or missing. Please add a valid \`${envKey}\` and restart the dev server.`
        : `⚠️ Something went wrong connecting to ${providerLabel}. Check the browser console for details (F12 → Console). Error: ${err?.message || 'Unknown error'}`;

      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        sender: 'synaptica',
        text: errorText,
        provider: activeProvider,
        isError: true,
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
      const response = await getSynthesizedResponse(userPrompt, historyBeforeMsg, activeMode, activeProvider);
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
        provider: response.provider || activeProvider,
        thinkingMs: Date.now() - startTime,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      }]);
    } catch (err) {
      console.error('[MindBot] Regenerate error:', err);
      setIsTyping(false);
      const isAuthError = err?.message?.includes('401') || err?.message?.includes('403') || err?.message?.includes('API key') || err?.message?.includes('INVALID_ARGUMENT');
      const envKey = activeProvider === 'groq' ? 'VITE_GROQ_API_KEY' : activeProvider === 'grok' ? 'VITE_GROK_API_KEY' : 'VITE_GEMINI_API_KEY';
      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        sender: 'synaptica',
        text: isAuthError
          ? `⚠️ API key error — please check your \`${envKey}\` in .env.`
          : `⚠️ Regeneration failed. Check the browser console (F12) for details.`,
        provider: activeProvider,
        isError: true,
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
    .cp-exit-input { animation: cp-blur-up 0.32s cubic-bezier(0.4,0,0.2,1) forwards; animation-delay: 0.12s; }
    @media (prefers-reduced-motion: reduce) {
      .cp-exit-logo, .cp-exit-title, .cp-exit-input { animation: none; opacity: 0; }
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
        }}
        hasStarted={hasStarted}
      />

      <HistoryDrawer
        isOpen={showHistoryDrawer}
        onClose={() => setShowHistoryDrawer(false)}
        sessions={sessions}
        onLoadSession={loadSession}
        onDeleteSession={deleteSession}
        onClearAll={clearAllSessions}
      />

      <main className="relative z-10 flex-1 flex flex-col overflow-hidden">

        {/* ── WELCOME SCREEN ── */}
        {!hasStarted && (
          <div
            className="flex-1 flex flex-col items-center justify-center px-4 sm:px-6 pb-20 sm:pb-12"
          >
            {/* Logo */}
            <motion.div
              initial={{ opacity: 0, scale: 0.75 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.05, duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
              className={`mb-5 sm:mb-7 ${transitioning ? 'cp-exit-logo' : ''}`}
            >
              <LogoMark size={36} />
            </motion.div>

            {/* Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15, duration: 0.5 }}
              className={`text-3xl sm:text-4xl lg:text-5xl font-light text-white text-center mb-7 sm:mb-10 px-2 ${transitioning ? 'cp-exit-title' : ''}`}
              style={{ letterSpacing: '-0.03em', lineHeight: 1.1 }}
            >
              What can I help you<br /><span style={{ opacity: 0.45 }}>explore today?</span>
            </motion.h1>

            {/* Input Box — slides up & blurs out */}
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.22, duration: 0.5 }}
              className={`w-full max-w-2xl mb-7 px-1 sm:px-0 ${transitioning ? 'cp-exit-input' : ''}`}
            >
              <InputBox
                value={inputVal} onChange={setInputVal}
                onSend={sendMessage} large
                activeMode={activeMode} onModeChange={setActiveMode}
                activeProvider={activeProvider} onProviderChange={setActiveProvider}
              />
            </motion.div>
          </div>
        )}

        {/* ── ACTIVE CONVERSATION ── */}
        <AnimatePresence>
          {hasStarted && (
            <motion.div
              key="chat"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="flex-1 flex flex-col overflow-hidden"
            >

              {/* Message thread */}
              <div
                className="flex-1 overflow-y-auto"
                style={{ paddingTop: '2.5rem', paddingBottom: '10rem' }}
              >
                <div className="max-w-3xl mx-auto space-y-8 px-3 sm:px-16 lg:px-6">
                  {messages.map((msg, idx) => {
                    if (msg.sender === 'user') return <UserMessage key={msg.id} msg={msg} />;
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

              {/* Floating input — with safe-area bottom for iOS */}
              <motion.div
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15, duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                className="absolute bottom-0 left-0 right-0 flex flex-col items-center px-3 sm:px-4 pt-2 pointer-events-none z-20 input-safe-area"
                style={{ paddingBottom: 'calc(env(safe-area-inset-bottom, 0px) + 1.25rem)' }}
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
