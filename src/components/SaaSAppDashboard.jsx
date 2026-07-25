import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Brain,
  Cpu,
  Sparkles,
  Send,
  User,
  LayoutDashboard,
  Bot,
  Zap,
  Layers,
  Database,
  BarChart3,
  Settings,
  Plus,
  Search,
  CheckCircle2,
  ArrowUpRight,
  ChevronDown,
  Terminal,
  Code2,
  ShieldCheck,
  Sun,
  Moon,
  RefreshCw,
  Copy,
  Check,
  ExternalLink,
  Flame,
  Activity,
  Sliders,
} from 'lucide-react';

/* ─── Mock Workspace Code & Spec Data ─────────────────────────── */
const sampleCodeSnippet = `// SYNAPTICA Dual-Stream Graph Engine v1.0.8
pub async fn execute_synaptic_pipeline(
    context: &HumanIntent,
    payload: &Dataset
) -> Result<VerifiedOutput, EngineError> {
    // 1. Parallel AI Computation Stream (Sub-millisecond)
    let ai_logic_future = tokio::spawn(compute_high_speed_patterns(payload));
    
    // 2. Human Intuition & Context Alignment Stream
    let human_context_future = tokio::spawn(validate_ethical_constraints(context));

    let (logic_res, context_res) = tokio::try_join!(ai_logic_future, human_context_future)??;

    // 3. Fusion Bridge Layer - Zero Hallucination Verification
    let synthesized_output = SynapseBridge::synthesize(logic_res, context_res)?;
    Ok(synthesized_output)
}`;

/* ─── Initial Conversation Stream ────────────────────────────── */
const initialChatMessages = [
  {
    id: 1,
    sender: 'user',
    text: 'How can we structure our distributed graph processing pipeline so it handles high throughput without introducing consensus latency?',
    time: '11:14 AM',
  },
  {
    id: 2,
    sender: 'synaptica',
    text: 'Here is the synthesized architecture combining parallel computational scale with intuitive human-in-the-loop controls:',
    aiReasoning: 'Graph partition analysis complete: Implemented asynchronous partition vertices using Pregel model with Chandy-Lamport snapshotting. Bypasses 90% of consensus wait states.',
    humanInsight: 'Engineering Context: Keep state mutators idempotent. This lets your team safely retry batch messages without complex manual rollback scripts.',
    time: '11:15 AM',
    codeSnippet: `async fn dispatch_vertex_batch(vertices: Vec<Vertex>) -> Result<(), GraphError> {
    let tasks = vertices.into_iter().map(|v| async move {
        v.compute_idempotent_state().await
    });
    futures::future::try_join_all(tasks).await?;
    Ok(())
}`,
  },
];

export default function SaaSAppDashboard({ onSwitchToLanding }) {
  const [activeTab, setActiveTab] = useState('copilot'); // 'overview' | 'copilot' | 'pipelines' | 'memory' | 'analytics' | 'settings'
  const [isDark, setIsDark] = useState(true);
  const [messages, setMessages] = useState(initialChatMessages);
  const [inputVal, setInputVal] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [selectedModel, setSelectedModel] = useState('SYNAPTICA-Dual-v1.0.8');
  const [copiedId, setCopiedId] = useState(null);
  const [workspaceView, setWorkspaceView] = useState('code'); // 'code' | 'tree' | 'logs'
  const [searchQuery, setSearchQuery] = useState('');

  const chatEndRef = useRef(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const toggleTheme = () => setIsDark((prev) => !prev);

  const handleSend = (presetText) => {
    const text = presetText || inputVal;
    if (!text.trim()) return;

    const userMsg = {
      id: Date.now(),
      sender: 'user',
      text: text,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputVal('');
    setIsTyping(true);

    setTimeout(() => {
      setIsTyping(false);
      const aiResponse = {
        id: Date.now() + 1,
        sender: 'synaptica',
        text: `Processed prompt: "${text}". Synthesized dual-stream output below:`,
        aiReasoning: `Fast Logic Engine: Executed pattern synthesis across 24,000 algorithmic nodes. Optimal path verified in 14ms.`,
        humanInsight: `Contextual Guardrail: Ensured code readability and backward compatibility so your team can deploy without breaking API contracts.`,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, aiResponse]);
    }, 1600);
  };

  const handleCopyCode = (id, text) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className={`min-h-screen bg-void-950 text-white font-body selection:bg-synapse-500 selection:text-white flex flex-col ${isDark ? '' : 'light-mode'}`}>
      
      {/* ════════════════════════════════════════════════════════ */}
      {/* 1. TOP GLOBAL NAVIGATION HEADER                         */}
      {/* ════════════════════════════════════════════════════════ */}
      <header className="h-16 border-b border-void-700 bg-void-900/90 backdrop-blur-xl px-4 sm:px-6 flex items-center justify-between z-30 sticky top-0">
        
        {/* Left: Brand & Status */}
        <div className="flex items-center gap-4">
          <a href="#" onClick={onSwitchToLanding} className="flex items-center gap-2.5 group">
            <div className="relative w-8 h-8 flex items-center justify-center">
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-ai-500 to-human-500 blur-sm opacity-60 group-hover:opacity-100 transition-opacity" />
              <svg viewBox="0 0 40 40" className="w-8 h-8 relative z-10">
                <line x1="8" y1="20" x2="32" y2="20" stroke="#7C5CFF" strokeWidth="2.5" strokeLinecap="round" />
                <circle cx="8" cy="20" r="5" fill="#00D4FF" className="animate-pulse" />
                <circle cx="32" cy="20" r="5" fill="#B24BF3" className="animate-pulse" />
              </svg>
            </div>
            <div className="flex flex-col">
              <span className="font-heading font-bold text-base text-white tracking-wider">
                SYNAPTICA
              </span>
              <span className="text-[9px] font-mono tracking-widest text-ai-400 uppercase -mt-1">
                SaaS AI Studio
              </span>
            </div>
          </a>

          <div className="hidden lg:flex items-center gap-2 px-3 py-1 rounded-full bg-void-950 border border-void-700 text-xs">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span className="text-gray-300 font-mono text-[11px]">
              Engine: Dual-Stream v1.0.8
            </span>
          </div>
        </div>

        {/* Center: Command Search Bar */}
        <div className="hidden md:flex items-center relative max-w-md w-full mx-4">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search prompts, sessions, models, or context keys... (Ctrl + K)"
            className="w-full bg-void-950 border border-void-700 rounded-full pl-10 pr-12 py-1.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-synapse-500 transition-all"
          />
          <kbd className="absolute right-3 text-[10px] font-mono text-gray-500 bg-void-900 border border-void-700 rounded px-1.5 py-0.5">
            ⌘K
          </kbd>
        </div>

        {/* Right Actions: View Switcher, Theme Toggle, Profile */}
        <div className="flex items-center gap-3">
          {/* Switch to Landing Page Button */}
          <button
            onClick={onSwitchToLanding}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-void-950 border border-void-700 hover:border-synapse-500 text-xs text-gray-300 hover:text-white transition-all cursor-pointer"
          >
            <span>Landing Overview</span>
            <ExternalLink className="w-3 h-3 text-ai-400" />
          </button>

          {/* Theme Switcher Button */}
          <button
            onClick={toggleTheme}
            aria-label={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            className="p-2 rounded-full bg-void-950 border border-void-700 text-gray-300 hover:text-white transition-all cursor-pointer"
          >
            {isDark ? <Sun className="w-4 h-4 text-amber-300" /> : <Moon className="w-4 h-4 text-slate-800" />}
          </button>

          {/* User Profile Avatar */}
          <div className="relative">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-ai-500 to-human-500 p-0.5 cursor-pointer">
              <div className="w-full h-full rounded-full bg-void-950 flex items-center justify-center">
                <User className="w-4 h-4 text-white" />
              </div>
            </div>
            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-void-900" />
          </div>
        </div>
      </header>

      {/* ════════════════════════════════════════════════════════ */}
      {/* 2. DASHBOARD BODY - SIDEBAR + WORKSPACE                  */}
      {/* ════════════════════════════════════════════════════════ */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* ── Left Sidebar Navigation ────────────────────────── */}
        <aside className="w-16 md:w-64 border-r border-void-700 bg-void-900/60 flex flex-col justify-between p-3 shrink-0">
          
          {/* Main Navigation Links */}
          <div className="space-y-6">
            
            {/* New AI Session Button */}
            <button
              onClick={() => handleSend('Start a fresh analysis session on distributed system scalability.')}
              className="w-full btn-duality py-2.5 px-3 rounded-2xl text-xs font-semibold flex items-center justify-center gap-2 cursor-pointer shadow-lg"
            >
              <Plus className="w-4 h-4 text-white" />
              <span className="hidden md:inline">New Session</span>
            </button>

            {/* Sidebar Tabs */}
            <nav className="space-y-1">
              {[
                { id: 'overview', label: 'Overview', icon: LayoutDashboard },
                { id: 'copilot', label: 'AI Copilot Studio', icon: Bot, badge: 'Live' },
                { id: 'pipelines', label: 'Automated Pipelines', icon: Zap },
                { id: 'memory', label: 'Context Memory', icon: Database },
                { id: 'analytics', label: 'Verifications & Metrics', icon: BarChart3 },
                { id: 'settings', label: 'Settings & API Keys', icon: Settings },
              ].map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                      isActive
                        ? 'bg-synapse-500/20 text-white border border-synapse-500/50 shadow-md'
                        : 'text-gray-400 hover:text-white hover:bg-void-800/60'
                    }`}
                  >
                    <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-synapse-400' : 'text-gray-400'}`} />
                    <span className="hidden md:inline flex-1 text-left">{item.label}</span>
                    {item.badge && (
                      <span className="hidden md:inline text-[9px] font-mono font-semibold px-1.5 py-0.5 rounded bg-ai-500/20 text-ai-400 border border-ai-500/30">
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Sidebar Footer: Token Usage Monitor */}
          <div className="hidden md:block p-3 rounded-2xl bg-void-950 border border-void-700 space-y-2">
            <div className="flex items-center justify-between text-[11px] font-mono">
              <span className="text-gray-400">Context Memory</span>
              <span className="text-ai-400 font-semibold">128k / 200k</span>
            </div>
            <div className="w-full h-1.5 rounded-full bg-void-800 overflow-hidden">
              <div className="h-full bg-gradient-to-r from-ai-500 via-synapse-500 to-human-500 w-[64%]" />
            </div>
            <span className="text-[10px] text-gray-500 block">GPU Cluster: Operational</span>
          </div>

        </aside>

        {/* ── Center Main Workspace ─────────────────────────── */}
        <main className="flex-1 flex flex-col overflow-y-auto bg-void-950 p-4 sm:p-6 space-y-6">
          
          {/* ── Top Bento Metric Cards ───────────────────────── */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            
            {/* Stat Card 1 */}
            <div className="glass-card rounded-2xl p-4 border-void-700 flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-400 font-medium">Active Synaptic Streams</span>
                <span className="text-[11px] font-mono text-emerald-400 font-semibold px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20">
                  +14.8%
                </span>
              </div>
              <div className="mt-3 flex items-baseline gap-2">
                <span className="text-2xl font-heading font-extrabold text-white tabular-nums">1,842</span>
                <span className="text-xs text-gray-500">concurrent</span>
              </div>
              <div className="mt-2 h-1 w-full bg-ai-500/30 rounded-full overflow-hidden">
                <div className="h-full bg-ai-400 w-[82%]" />
              </div>
            </div>

            {/* Stat Card 2 */}
            <div className="glass-card rounded-2xl p-4 border-void-700 flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-400 font-medium">Avg Dual Latency</span>
                <span className="text-[11px] font-mono text-ai-400 font-semibold px-2 py-0.5 rounded bg-ai-500/10 border border-ai-500/20">
                  -12ms faster
                </span>
              </div>
              <div className="mt-3 flex items-baseline gap-2">
                <span className="text-2xl font-heading font-extrabold text-white tabular-nums">38ms</span>
                <span className="text-xs text-gray-500">synthesis time</span>
              </div>
              <div className="mt-2 h-1 w-full bg-synapse-500/30 rounded-full overflow-hidden">
                <div className="h-full bg-synapse-400 w-[94%]" />
              </div>
            </div>

            {/* Stat Card 3 */}
            <div className="glass-card rounded-2xl p-4 border-void-700 flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-400 font-medium">Logic Verifiability</span>
                <span className="text-[11px] font-mono text-human-400 font-semibold px-2 py-0.5 rounded bg-human-500/10 border border-human-500/20">
                  100% Zero Leak
                </span>
              </div>
              <div className="mt-3 flex items-baseline gap-2">
                <span className="text-2xl font-heading font-extrabold text-white tabular-nums">99.4%</span>
                <span className="text-xs text-gray-500">accuracy rate</span>
              </div>
              <div className="mt-2 h-1 w-full bg-human-500/30 rounded-full overflow-hidden">
                <div className="h-full bg-human-400 w-[99%]" />
              </div>
            </div>

            {/* Stat Card 4 */}
            <div className="glass-card rounded-2xl p-4 border-void-700 flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-400 font-medium">Tokens Saved</span>
                <span className="text-[11px] font-mono text-emerald-400 font-semibold px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20">
                  +28.4%
                </span>
              </div>
              <div className="mt-3 flex items-baseline gap-2">
                <span className="text-2xl font-heading font-extrabold text-white tabular-nums">1.2M</span>
                <span className="text-xs text-gray-500">this month</span>
              </div>
              <div className="mt-2 h-1 w-full bg-emerald-500/30 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-400 w-[78%]" />
              </div>
            </div>

          </div>

          {/* ── Main Split View SaaS Workspace ──────────────── */}
          <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-[520px]">
            
            {/* ── Left Column (7 cols): Data & Code Workspace ── */}
            <div className="lg:col-span-7 flex flex-col glass-card rounded-3xl border border-void-700 overflow-hidden">
              
              {/* Workspace Header Tabs */}
              <div className="bg-void-900/90 px-4 py-3 border-b border-void-700 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {[
                    { id: 'code', label: 'Code & Architecture', icon: Code2 },
                    { id: 'tree', label: 'Reasoning Tree', icon: Layers },
                    { id: 'logs', label: 'Execution Logs', icon: Terminal },
                  ].map((vw) => {
                    const Icon = vw.icon;
                    return (
                      <button
                        key={vw.id}
                        onClick={() => setWorkspaceView(vw.id)}
                        className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                          workspaceView === vw.id
                            ? 'bg-void-800 text-white border border-void-700 shadow'
                            : 'text-gray-400 hover:text-white hover:bg-void-950'
                        }`}
                      >
                        <Icon className="w-3.5 h-3.5 text-synapse-400" />
                        <span>{vw.label}</span>
                      </button>
                    );
                  })}
                </div>

                <span className="text-[11px] font-mono text-ai-400">
                  Target: src/engine/synapse.rs
                </span>
              </div>

              {/* Workspace View Content */}
              <div className="flex-1 p-4 bg-void-950/80 font-mono text-xs overflow-x-auto relative">
                {workspaceView === 'code' && (
                  <div className="space-y-2 text-gray-300 leading-relaxed">
                    <div className="flex items-center justify-between text-[11px] text-gray-500 pb-2 border-b border-void-800 font-sans">
                      <span>Live Rust Async Runtime</span>
                      <button
                        onClick={() => handleCopyCode('editor', sampleCodeSnippet)}
                        className="flex items-center gap-1 hover:text-white transition-colors"
                      >
                        {copiedId === 'editor' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{copiedId === 'editor' ? 'Copied' : 'Copy'}</span>
                      </button>
                    </div>
                    <pre className="text-ai-300"><code>{sampleCodeSnippet}</code></pre>
                  </div>
                )}

                {workspaceView === 'tree' && (
                  <div className="p-4 space-y-4">
                    <div className="p-3 rounded-xl bg-void-900 border border-synapse-500/40 text-xs">
                      <span className="font-bold text-synapse-400 block mb-1">Root Intent Node</span>
                      <p className="text-gray-300 font-sans">"Structure graph pipeline for zero consensus latency"</p>
                    </div>
                    <div className="pl-6 border-l-2 border-synapse-500/30 space-y-3">
                      <div className="p-3 rounded-xl bg-ai-500/10 border border-ai-500/30 text-xs">
                        <span className="font-bold text-ai-400 block mb-1">Branch A: Computational Scaling</span>
                        <p className="text-gray-300 font-sans">Applied Pregel vertex model with async snapshotting.</p>
                      </div>
                      <div className="p-3 rounded-xl bg-human-500/10 border border-human-500/30 text-xs">
                        <span className="font-bold text-human-400 block mb-1">Branch B: Contextual Safety Guardrail</span>
                        <p className="text-gray-300 font-sans">Enforced idempotent state mutators for clean developer retries.</p>
                      </div>
                    </div>
                  </div>
                )}

                {workspaceView === 'logs' && (
                  <div className="space-y-1.5 text-gray-400">
                    <p className="text-emerald-400">[11:15:02] INFO: Synaptic dual-stream initialized successfully.</p>
                    <p className="text-ai-400">[11:15:03] LOGIC: Partition graph verified (24,000 vertices in 14ms).</p>
                    <p className="text-human-400">[11:15:04] INTENT: Human safety constraints aligned 100%.</p>
                    <p className="text-gray-500">[11:15:05] SYSTEM: Session memory state persisted to cluster.</p>
                  </div>
                )}
              </div>

              {/* Footer Indicator */}
              <div className="px-4 py-2 bg-void-900 border-t border-void-700 flex items-center justify-between text-[11px] font-mono text-gray-400">
                <div className="flex items-center gap-2">
                  <Activity className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
                  <span>CPU: 12.4% | RAM: 1.8GB / 16GB</span>
                </div>
                <span>Sync State: Clean</span>
              </div>
            </div>

            {/* ── Right Column (5 cols): AI Copilot Drawer ─────── */}
            <div className="lg:col-span-5 flex flex-col glass-card rounded-3xl border border-void-700 overflow-hidden">
              
              {/* Copilot Header */}
              <div className="bg-void-900/90 px-4 py-3 border-b border-void-700 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Bot className="w-4 h-4 text-synapse-400" />
                  <select
                    value={selectedModel}
                    onChange={(e) => setSelectedModel(e.target.value)}
                    className="bg-void-950 border border-void-700 rounded-lg px-2.5 py-1 text-xs text-white focus:outline-none"
                  >
                    <option value="SYNAPTICA-Dual-v1.0.8">SYNAPTICA-Dual-v1.0.8</option>
                    <option value="DeepReasoning-v2">DeepReasoning-v2</option>
                  </select>
                </div>

                <div className="flex items-center gap-1.5 text-[10px] font-mono text-emerald-400">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                  <span>Online</span>
                </div>
              </div>

              {/* Chat Message Stream */}
              <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-void-950/60 max-h-[440px]">
                {messages.map((msg) => (
                  <div key={msg.id} className="space-y-2">
                    {msg.sender === 'user' ? (
                      <div className="flex justify-end items-start gap-2">
                        <div className="bg-void-800 border border-void-700 rounded-2xl rounded-tr-none p-3 max-w-sm text-xs text-gray-200">
                          <p>{msg.text}</p>
                          <span className="text-[9px] font-mono text-gray-400 block text-right mt-1">{msg.time}</span>
                        </div>
                        <div className="w-7 h-7 rounded-full bg-human-500/20 border border-human-500/40 flex items-center justify-center shrink-0">
                          <User className="w-3.5 h-3.5 text-human-400" />
                        </div>
                      </div>
                    ) : (
                      <div className="flex justify-start items-start gap-2">
                        <div className="w-7 h-7 rounded-full bg-synapse-500/20 border border-synapse-500/40 flex items-center justify-center shrink-0">
                          <Sparkles className="w-3.5 h-3.5 text-synapse-400" />
                        </div>
                        <div className="bg-void-900 border border-void-700 rounded-2xl rounded-tl-none p-3.5 text-xs text-white max-w-sm w-full space-y-3">
                          <p className="leading-snug">{msg.text}</p>

                          {/* Dual Perspective Cards */}
                          <div className="space-y-2">
                            <div className="p-2.5 rounded-xl bg-ai-500/10 border border-ai-500/30 text-[11px]">
                              <div className="flex items-center gap-1 text-ai-400 font-mono font-semibold mb-1">
                                <Cpu className="w-3 h-3" />
                                <span>AI Computational Stream</span>
                              </div>
                              <p className="text-gray-300">{msg.aiReasoning}</p>
                            </div>

                            <div className="p-2.5 rounded-xl bg-human-500/10 border border-human-500/30 text-[11px]">
                              <div className="flex items-center gap-1 text-human-400 font-mono font-semibold mb-1">
                                <Brain className="w-3 h-3" />
                                <span>Human Context Stream</span>
                              </div>
                              <p className="text-gray-300">{msg.humanInsight}</p>
                            </div>
                          </div>

                          <span className="text-[9px] font-mono text-gray-500 block">{msg.time} • Verified</span>
                        </div>
                      </div>
                    )}
                  </div>
                ))}

                {isTyping && (
                  <div className="flex items-center gap-2 text-xs text-gray-400 font-mono">
                    <Sparkles className="w-3.5 h-3.5 text-synapse-400 animate-spin" />
                    <span>Synthesizing dual response...</span>
                  </div>
                )}
                <div ref={chatEndRef} />
              </div>

              {/* Preset Prompts Row */}
              <div className="px-3 py-2 bg-void-900 border-t border-void-800 flex flex-wrap gap-1.5">
                {[
                  "Optimize Rust async loop",
                  "Verify logic tree",
                  "Refactor graph snapshot",
                ].map((p, i) => (
                  <button
                    key={i}
                    onClick={() => handleSend(p)}
                    className="text-[11px] font-medium text-gray-300 hover:text-white bg-void-800 hover:bg-void-700 border border-void-700 rounded-full px-2.5 py-0.5 transition-all cursor-pointer"
                  >
                    {p}
                  </button>
                ))}
              </div>

              {/* Input Area */}
              <div className="p-3 bg-void-900 border-t border-void-700 flex items-center gap-2">
                <input
                  type="text"
                  value={inputVal}
                  onChange={(e) => setInputVal(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Ask SYNAPTICA copilot..."
                  className="flex-1 bg-void-950 border border-void-700 rounded-xl px-3.5 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-synapse-500"
                />
                <button
                  onClick={() => handleSend()}
                  disabled={!inputVal.trim() || isTyping}
                  className="btn-duality p-2.5 rounded-xl disabled:opacity-50 cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5 text-white" />
                </button>
              </div>

            </div>

          </div>

        </main>
      </div>

    </div>
  );
}
