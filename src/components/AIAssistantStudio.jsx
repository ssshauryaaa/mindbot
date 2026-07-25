import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  Plus, Bookmark, Compass, LayoutGrid, LayoutDashboard,
  MoreHorizontal, Sparkles, Brain, Cpu, User, Search,
  Sun, Moon, Settings, Database, BarChart3, Zap, Bot,
  Code2, Layers, Terminal, Copy, Check, Send, Activity,
  MessageSquare, ArrowUpRight, ChevronDown, Bell, Share2,
} from 'lucide-react';

/* ════════════════════════════════════════════════════════════════
   SIDEBAR — Full labeled nav for dashboard
════════════════════════════════════════════════════════════════ */
const NAV_ITEMS = [
  { icon: LayoutDashboard, label: 'Overview',          id: 'overview'  },
  { icon: Bot,             label: 'AI Copilot',        id: 'copilot', badge: 'Live' },
  { icon: Zap,             label: 'Pipelines',         id: 'pipelines' },
  { icon: Database,        label: 'Context Memory',    id: 'memory'    },
  { icon: BarChart3,       label: 'Analytics',         id: 'analytics' },
  { icon: Settings,        label: 'Settings',          id: 'settings'  },
];

function DashSidebar({ activeTab, setActiveTab, onGoToChat }) {
  return (
    <aside className="shrink-0 flex flex-col"
      style={{
        width: 60,
        background: 'rgba(8,9,15,0.80)',
        backdropFilter: 'blur(24px)',
        WebkitBackdropFilter: 'blur(24px)',
        borderRight: '1px solid rgba(255,255,255,0.06)',
        transition: 'width 0.3s ease',
      }}>

      {/* Brand */}
      <div className="flex items-center justify-center py-4 shrink-0" style={{ borderBottom:'1px solid rgba(255,255,255,0.06)' }}>
        <svg viewBox="0 0 40 40" className="w-7 h-7">
          <line x1="8" y1="20" x2="32" y2="20" stroke="#7c5cff" strokeWidth="2.2" strokeLinecap="round"/>
          <circle cx="8"  cy="20" r="4.5" fill="#00c8ef" className="animate-pulse"/>
          <circle cx="32" cy="20" r="4.5" fill="#a855f7" className="animate-pulse"/>
        </svg>
      </div>

      {/* New session */}
      <div className="px-3 py-3 shrink-0">
        <button onClick={onGoToChat}
          className="w-full rounded-2xl py-2 flex items-center justify-center cursor-pointer transition-all"
          style={{ background:'linear-gradient(135deg,#00c8ef,#7c5cff,#a855f7)', boxShadow:'0 0 14px rgba(124,92,255,0.4)' }}>
          <Plus className="w-4 h-4 text-white" strokeWidth={2}/>
        </button>
      </div>

      {/* Nav links */}
      <nav className="flex-1 flex flex-col gap-1 px-2 py-2 overflow-y-auto">
        {NAV_ITEMS.map(({ icon: Icon, label, id, badge }) => {
          const active = activeTab === id;
          return (
            <button key={id} onClick={() => setActiveTab(id)} title={label} aria-label={label}
              className={`w-full flex items-center justify-center px-0 py-2.5 rounded-xl transition-all cursor-pointer group relative ${
                active ? 'text-white' : 'text-white/35 hover:text-white/75 hover:bg-white/5'
              }`}
              style={active ? { background:'rgba(124,92,255,0.18)', border:'1px solid rgba(124,92,255,0.4)', boxShadow:'0 0 12px rgba(124,92,255,0.15)' } : { border:'1px solid transparent' }}>
              <Icon className="w-[18px] h-[18px]" strokeWidth={1.6}/>
              {badge && <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-ai-400"/>}
              {/* Tooltip */}
              <span className="absolute left-full ml-3 whitespace-nowrap text-[11px] font-medium text-white bg-void-800 border border-void-700 px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50 shadow-lg">
                {label}
              </span>
            </button>
          );
        })}
      </nav>

      {/* Footer: Token usage */}
      <div className="px-3 py-3 shrink-0 space-y-2" style={{ borderTop:'1px solid rgba(255,255,255,0.06)' }}>
        <div className="w-full h-1 rounded-full overflow-hidden" style={{ background:'rgba(255,255,255,0.06)' }}>
          <div className="h-full rounded-full" style={{ width:'64%', background:'linear-gradient(90deg,#00c8ef,#7c5cff,#a855f7)' }}/>
        </div>
      </div>
    </aside>
  );
}

/* ════════════════════════════════════════════════════════════════
   BENTO METRIC CARDS
════════════════════════════════════════════════════════════════ */
const METRICS = [
  { label:'Active Streams',     value:'1,842',  unit:'concurrent',    delta:'+14.8%', color:'#00c8ef', w:'82%' },
  { label:'Avg Dual Latency',   value:'38ms',   unit:'synthesis',     delta:'-12ms',  color:'#7c5cff', w:'94%' },
  { label:'Logic Accuracy',     value:'99.4%',  unit:'verified',      delta:'100% Clean', color:'#a855f7', w:'99%' },
  { label:'Tokens Processed',   value:'1.2M',   unit:'this session',  delta:'+28.4%', color:'#10b981', w:'78%' },
];

function MetricCards() {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
      {METRICS.map((m, i) => (
        <motion.div key={m.label} initial={{ opacity:0, y:14 }} animate={{ opacity:1, y:0 }}
          transition={{ delay: i * 0.06, duration:0.4 }}
          className="glass-card rounded-2xl p-4 flex flex-col justify-between gap-3">
          <div className="flex items-start justify-between">
            <span className="text-xs text-white/45 font-medium leading-tight">{m.label}</span>
            <span className="text-[11px] font-mono font-semibold px-2 py-0.5 rounded-lg shrink-0"
              style={{ color:m.color, background:`${m.color}18`, border:`1px solid ${m.color}30` }}>
              {m.delta}
            </span>
          </div>
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-heading font-extrabold text-white tabular">{m.value}</span>
              <span className="text-xs text-white/35">{m.unit}</span>
            </div>
            <div className="mt-2 h-1 w-full rounded-full overflow-hidden" style={{ background:'rgba(255,255,255,0.06)' }}>
              <div className="h-full rounded-full" style={{ width:m.w, background:m.color, boxShadow:`0 0 6px ${m.color}60` }}/>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════
   WORKSPACE PANEL (Left — Code / Reasoning Tree / Logs)
════════════════════════════════════════════════════════════════ */
const CODE_SAMPLE = `// SYNAPTICA Dual-Stream Engine v1.0.8
pub async fn execute_synaptic_pipeline(
    context: &HumanIntent,
    payload: &Dataset
) -> Result<VerifiedOutput, EngineError> {
    // 1. Parallel AI Computation Stream
    let ai_future = tokio::spawn(
        compute_high_speed_patterns(payload)
    );
    // 2. Human Intuition & Context Alignment
    let human_future = tokio::spawn(
        validate_ethical_constraints(context)
    );
    let (logic_res, ctx_res) =
        tokio::try_join!(ai_future, human_future)??;

    // 3. Fusion Bridge — Zero-Hallucination
    let output = SynapseBridge::synthesize(
        logic_res, ctx_res
    )?;
    Ok(output)
}`;

function WorkspacePanel() {
  const [view, setView] = useState('code');
  const [copied, setCopied] = useState(false);

  const copyCode = () => {
    navigator.clipboard.writeText(CODE_SAMPLE);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const TABS = [
    { id:'code', label:'Code & Architecture', icon: Code2 },
    { id:'tree', label:'Reasoning Tree',      icon: Layers },
    { id:'logs', label:'Execution Logs',      icon: Terminal },
  ];

  return (
    <div className="glass-card rounded-2xl overflow-hidden flex flex-col" style={{ minHeight:0 }}>
      {/* Header */}
      <div className="px-4 py-3 flex items-center justify-between shrink-0"
        style={{ borderBottom:'1px solid rgba(255,255,255,0.07)', background:'rgba(8,9,15,0.5)' }}>
        <div className="flex items-center gap-1.5 overflow-x-auto">
          {TABS.map(({ id, label, icon: Icon }) => (
            <button key={id} onClick={() => setView(id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all cursor-pointer ${
                view === id ? 'text-white' : 'text-white/35 hover:text-white/65'
              }`}
              style={view === id ? { background:'rgba(255,255,255,0.08)', border:'1px solid rgba(255,255,255,0.1)' } : { border:'1px solid transparent' }}>
              <Icon className="w-3.5 h-3.5 text-synapse-400" strokeWidth={1.5}/>
              <span>{label}</span>
            </button>
          ))}
        </div>
        <button onClick={copyCode} title="Copy"
          className="flex items-center gap-1.5 text-[11px] text-white/35 hover:text-white/70 transition-colors cursor-pointer ml-2">
          {copied ? <Check className="w-3.5 h-3.5 text-emerald-400"/> : <Copy className="w-3.5 h-3.5"/>}
          <span>{copied ? 'Copied' : 'Copy'}</span>
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4" style={{ background:'rgba(6,7,11,0.55)', fontFamily:'monospace' }}>
        {view === 'code' && (
          <pre className="text-xs text-ai-300/90 leading-relaxed whitespace-pre-wrap">{CODE_SAMPLE}</pre>
        )}
        {view === 'tree' && (
          <div className="space-y-3 text-xs font-sans">
            <div className="p-3 rounded-xl" style={{ background:'rgba(124,92,255,0.1)', border:'1px solid rgba(124,92,255,0.3)' }}>
              <p className="font-semibold text-synapse-400 mb-1">Root Intent</p>
              <p className="text-white/60">"Optimize distributed graph pipeline for zero consensus latency"</p>
            </div>
            <div className="pl-5 border-l-2 space-y-2" style={{ borderColor:'rgba(124,92,255,0.25)' }}>
              <div className="p-3 rounded-xl" style={{ background:'rgba(0,200,239,0.08)', border:'1px solid rgba(0,200,239,0.25)' }}>
                <p className="font-semibold text-ai-400 mb-1">Branch A — AI Compute</p>
                <p className="text-white/55">Pregel vertex model + Chandy-Lamport snapshotting. Bypasses 90% consensus wait.</p>
              </div>
              <div className="p-3 rounded-xl" style={{ background:'rgba(168,85,247,0.08)', border:'1px solid rgba(168,85,247,0.25)' }}>
                <p className="font-semibold text-human-400 mb-1">Branch B — Human Context</p>
                <p className="text-white/55">Idempotent state mutators enforced. Safe retry without rollback scripts.</p>
              </div>
            </div>
          </div>
        )}
        {view === 'logs' && (
          <div className="space-y-1 text-xs font-mono">
            <p><span className="text-emerald-400">[11:15:02]</span> <span className="text-white/55">INFO: Dual-stream engine initialized ✓</span></p>
            <p><span className="text-ai-400">[11:15:03]</span> <span className="text-white/55">LOGIC: 24,000 vertex partitions verified in 14ms</span></p>
            <p><span className="text-human-400">[11:15:04]</span> <span className="text-white/55">INTENT: Ethical constraints aligned (100%)</span></p>
            <p><span className="text-synapse-400">[11:15:05]</span> <span className="text-white/55">BRIDGE: SynapseBridge fusion complete</span></p>
            <p><span className="text-white/30">[11:15:05]</span> <span className="text-white/40">SYSTEM: Session state persisted to cluster</span></p>
          </div>
        )}
      </div>

      {/* Footer runtime indicator */}
      <div className="shrink-0 flex items-center justify-between px-4 py-2 text-[11px] font-mono text-white/30"
        style={{ borderTop:'1px solid rgba(255,255,255,0.06)', background:'rgba(8,9,15,0.4)' }}>
        <div className="flex items-center gap-1.5">
          <Activity className="w-3.5 h-3.5 text-emerald-400 animate-pulse"/>
          <span>CPU: 12.4% · RAM: 1.8 / 16 GB</span>
        </div>
        <span className="text-emerald-400/70">Sync: Clean</span>
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════
   COPILOT PANEL (Right)
════════════════════════════════════════════════════════════════ */
const INITIAL_MESSAGES = [
  {
    id: 1, sender:'user',
    text: 'How do we structure a distributed graph pipeline for high throughput without consensus latency?',
    time: '11:14',
  },
  {
    id: 2, sender:'synaptica',
    text: 'Synthesized dual-stream architecture combining computational scale with human-in-the-loop guardrails:',
    aiReasoning: 'Pregel model + async Chandy-Lamport snapshotting bypasses 90% of consensus wait states. Verified in 14ms.',
    humanInsight: 'Idempotent state mutators allow safe retries without complex rollback — ideal for team environments.',
    time: '11:15',
  },
];

const CHIP_PROMPTS = ['Optimize Rust async', 'Verify logic tree', 'Refactor snapshot'];

function CopilotPanel() {
  const [messages, setMessages] = useState(INITIAL_MESSAGES);
  const [inputVal, setInputVal] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [model, setModel] = useState('SYNAPTICA-Dual');
  const chatEnd = useRef(null);

  useEffect(() => { chatEnd.current?.scrollIntoView({ behavior:'smooth' }); }, [messages, isTyping]);

  const send = text => {
    const t = text || inputVal;
    if (!t.trim()) return;
    setInputVal('');
    setMessages(prev => [...prev, {
      id: Date.now(), sender:'user', text: t,
      time: new Date().toLocaleTimeString([], { hour:'2-digit', minute:'2-digit' }),
    }]);
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      setMessages(prev => [...prev, {
        id: Date.now() + 1, sender:'synaptica',
        text: `Dual analysis for: "${t.slice(0,55)}${t.length>55?'…':''}"`,
        aiReasoning: 'Pattern engine: optimal path found in 18ms across 1.2M nodes.',
        humanInsight: 'Context guardrail: aligned with practical deployment constraints.',
        time: new Date().toLocaleTimeString([], { hour:'2-digit', minute:'2-digit' }),
      }]);
    }, 1500);
  };

  return (
    <div className="glass-card rounded-2xl overflow-hidden flex flex-col" style={{ minHeight:0 }}>
      {/* Header */}
      <div className="px-4 py-3 shrink-0 flex items-center justify-between"
        style={{ borderBottom:'1px solid rgba(255,255,255,0.07)', background:'rgba(8,9,15,0.5)' }}>
        <div className="flex items-center gap-2">
          <Bot className="w-4 h-4 text-synapse-400" strokeWidth={1.5}/>
          <select value={model} onChange={e=>setModel(e.target.value)}
            className="bg-transparent border-none text-xs text-white/75 focus:outline-none cursor-pointer">
            <option value="SYNAPTICA-Dual">SYNAPTICA-Dual-v1.0.8</option>
            <option value="DeepReasoning">DeepReasoning-v2</option>
          </select>
        </div>
        <div className="flex items-center gap-1.5 text-[10px] font-mono text-emerald-400">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"/>
          <span>Active</span>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4" style={{ background:'rgba(8,9,15,0.35)', maxHeight:360 }}>
        {messages.map(msg => (
          <div key={msg.id}>
            {msg.sender === 'user' ? (
              <div className="flex justify-end">
                <div className="max-w-xs px-3.5 py-2.5 rounded-2xl rounded-tr-sm text-xs text-white/85 leading-relaxed"
                  style={{ background:'rgba(35,38,62,0.8)', border:'1px solid rgba(255,255,255,0.09)' }}>
                  <p>{msg.text}</p>
                  <span className="text-[9px] font-mono text-white/25 block text-right mt-1">{msg.time}</span>
                </div>
              </div>
            ) : (
              <div className="flex gap-2 items-start">
                <div className="w-6 h-6 rounded-full flex items-center justify-center shrink-0"
                  style={{ background:'rgba(124,92,255,0.2)', border:'1px solid rgba(124,92,255,0.4)' }}>
                  <Sparkles className="w-3 h-3 text-synapse-400"/>
                </div>
                <div className="max-w-xs rounded-2xl rounded-tl-sm p-3 space-y-2.5 text-xs text-white/80"
                  style={{ background:'rgba(14,16,26,0.85)', border:'1px solid rgba(255,255,255,0.08)' }}>
                  <p className="leading-snug">{msg.text}</p>
                  {msg.aiReasoning && (
                    <div className="p-2 rounded-lg text-[11px]"
                      style={{ background:'rgba(0,200,239,0.07)', border:'1px solid rgba(0,200,239,0.2)' }}>
                      <div className="flex items-center gap-1 text-ai-400 font-mono font-semibold mb-1">
                        <Cpu className="w-2.5 h-2.5"/><span>AI Stream</span>
                      </div>
                      <p className="text-white/55">{msg.aiReasoning}</p>
                    </div>
                  )}
                  {msg.humanInsight && (
                    <div className="p-2 rounded-lg text-[11px]"
                      style={{ background:'rgba(168,85,247,0.07)', border:'1px solid rgba(168,85,247,0.2)' }}>
                      <div className="flex items-center gap-1 text-human-400 font-mono font-semibold mb-1">
                        <Brain className="w-2.5 h-2.5"/><span>Human Stream</span>
                      </div>
                      <p className="text-white/55">{msg.humanInsight}</p>
                    </div>
                  )}
                  <span className="text-[9px] font-mono text-white/25">{msg.time} · Verified</span>
                </div>
              </div>
            )}
          </div>
        ))}
        {isTyping && (
          <div className="flex items-center gap-2 text-xs text-white/40 font-mono">
            <Sparkles className="w-3.5 h-3.5 text-synapse-400 animate-spin"/>
            <span>Synthesizing...</span>
            <div className="flex gap-0.5 ml-1">
              <span className="w-1 h-1 rounded-full bg-ai-400 inline-block typing-dot-1"/>
              <span className="w-1 h-1 rounded-full bg-synapse-400 inline-block typing-dot-2"/>
              <span className="w-1 h-1 rounded-full bg-human-400 inline-block typing-dot-3"/>
            </div>
          </div>
        )}
        <div ref={chatEnd}/>
      </div>

      {/* Quick chips */}
      <div className="px-3 py-2 flex flex-wrap gap-1.5 shrink-0"
        style={{ borderTop:'1px solid rgba(255,255,255,0.06)', background:'rgba(8,9,15,0.4)' }}>
        {CHIP_PROMPTS.map(p => (
          <button key={p} onClick={() => send(p)}
            className="text-[11px] text-white/45 hover:text-white/80 px-2.5 py-1 rounded-lg transition-all cursor-pointer"
            style={{ background:'rgba(255,255,255,0.05)', border:'1px solid rgba(255,255,255,0.08)' }}>
            {p}
          </button>
        ))}
      </div>

      {/* Input */}
      <div className="px-3 pb-3 shrink-0 flex gap-2"
        style={{ background:'rgba(8,9,15,0.4)' }}>
        <input value={inputVal} onChange={e=>setInputVal(e.target.value)}
          onKeyDown={e=>{ if(e.key==='Enter') send(); }}
          placeholder="Ask the copilot..."
          className="flex-1 bg-transparent rounded-xl px-3.5 py-2 text-xs text-white/85 placeholder-white/25 focus:outline-none"
          style={{ background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.09)' }}
        />
        <button onClick={() => send()} disabled={!inputVal.trim() || isTyping}
          className="w-8 h-8 rounded-xl flex items-center justify-center btn-primary shrink-0 self-center">
          <Send className="w-3.5 h-3.5 text-white"/>
        </button>
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════
   MAIN DASHBOARD PAGE
════════════════════════════════════════════════════════════════ */
export default function AIAssistantStudio() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('copilot');
  const [isDark, setIsDark] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="flex h-screen w-screen overflow-hidden" style={{ background:'var(--void-950)' }}>

      {/* Sidebar */}
      <DashSidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onGoToChat={() => navigate('/')}
      />

      {/* Main dashboard area */}
      <div className="flex-1 flex flex-col overflow-hidden">

        {/* ── TOP HEADER ──────────────────────────────────── */}
        <header className="shrink-0 h-14 flex items-center justify-between px-5"
          style={{ borderBottom:'1px solid rgba(255,255,255,0.06)', background:'rgba(8,9,15,0.70)', backdropFilter:'blur(24px)' }}>

          {/* Left: title + engine status */}
          <div className="flex items-center gap-3">
            <span className="font-heading font-bold text-base text-white tracking-wide">SYNAPTICA</span>
            <span className="text-[10px] font-mono tracking-widest text-ai-400 hidden sm:block">AI STUDIO</span>
            <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-mono"
              style={{ background:'rgba(16,185,129,0.08)', border:'1px solid rgba(16,185,129,0.2)' }}>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"/>
              <span className="text-emerald-400">Dual-Stream v1.0.8</span>
            </div>
          </div>

          {/* Center: search */}
          <div className="hidden md:flex items-center relative max-w-sm w-full">
            <Search className="w-4 h-4 text-white/30 absolute left-3.5"/>
            <input value={searchQuery} onChange={e=>setSearchQuery(e.target.value)}
              placeholder="Search prompts, models, sessions…"
              className="w-full bg-transparent rounded-full pl-10 pr-4 py-1.5 text-xs text-white/75 placeholder-white/25 focus:outline-none transition-all"
              style={{ background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.08)' }}
            />
          </div>

          {/* Right: actions */}
          <div className="flex items-center gap-2.5">
            <button onClick={() => navigate('/')}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs text-white/50 hover:text-white transition-colors cursor-pointer"
              style={{ background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.08)' }}>
              <MessageSquare className="w-3.5 h-3.5 text-ai-400"/>
              <span>Chat View</span>
            </button>
            <button onClick={() => setIsDark(d => !d)}
              className="w-8 h-8 flex items-center justify-center rounded-xl text-white/45 hover:text-white transition-colors cursor-pointer"
              style={{ background:'rgba(255,255,255,0.05)', border:'1px solid rgba(255,255,255,0.08)' }}>
              {isDark ? <Sun className="w-4 h-4 text-amber-300"/> : <Moon className="w-4 h-4"/>}
            </button>
            <div className="relative">
              <div className="w-8 h-8 rounded-full flex items-center justify-center p-0.5 cursor-pointer"
                style={{ background:'linear-gradient(135deg,#00c8ef,#7c5cff,#a855f7)', boxShadow:'0 0 10px rgba(124,92,255,0.4)' }}>
                <div className="w-full h-full rounded-full flex items-center justify-center"
                  style={{ background:'var(--void-950)' }}>
                  <User className="w-4 h-4 text-white"/>
                </div>
              </div>
              <span className="absolute bottom-0 right-0 w-2 h-2 rounded-full bg-emerald-400 border-2" style={{ borderColor:'var(--void-950)' }}/>
            </div>
          </div>
        </header>

        {/* ── MAIN DASHBOARD SCROLL AREA ──────────────────── */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-5">

          {/* Metric cards */}
          <MetricCards/>

          {/* Split Workspace */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5" style={{ minHeight:480 }}>
            {/* Workspace Left */}
            <div className="lg:col-span-7 flex flex-col" style={{ minHeight:0 }}>
              <WorkspacePanel/>
            </div>
            {/* Copilot Right */}
            <div className="lg:col-span-5 flex flex-col" style={{ minHeight:0 }}>
              <CopilotPanel/>
            </div>
          </div>

        </main>
      </div>
    </div>
  );
}
