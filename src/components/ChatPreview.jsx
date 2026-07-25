import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Bot, User, Sparkles, Cpu, Brain, CheckCircle, RefreshCw } from 'lucide-react';

const samplePrompts = [
  "Explain quantum entanglement using simple intuition.",
  "Optimize this Rust async loop for low latency.",
  "Design a fault-tolerant microservice architecture.",
];

export default function ChatPreview({ onLaunchClick }) {
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'user',
      text: 'How can we structure our distributed graph processing system so it scales without introducing high consensus latency?',
      time: '10:42 AM',
    },
    {
      id: 2,
      sender: 'synaptica',
      text: 'Here is a dual-perspective architecture combining high-speed parallel computation with intuitive fault-tolerance controls:',
      aiReasoning: 'Graph partition analysis complete: Implemented asynchronous partition vertices using Pregel model with Chandy-Lamport snapshotting. Bypasses 90% of consensus wait states.',
      humanInsight: 'Engineering Context: Keep state mutators idempotent. This lets your team safely retry batch messages without complex manual rollback scripts.',
      time: '10:42 AM',
      codeSnippet: `// Synaptica Parallel Vertex Dispatcher
async fn dispatch_vertex_batch(vertices: Vec<Vertex>) -> Result<(), GraphError> {
    let tasks = vertices.into_iter().map(|v| async move {
        v.compute_idempotent_state().await
    });
    futures::future::try_join_all(tasks).await?;
    Ok(())
}`,
    },
  ]);

  const [inputVal, setInputVal] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSend = (textToSend) => {
    const text = textToSend || inputVal;
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

    // Simulate AI dual reasoning response after delay
    setTimeout(() => {
      setIsTyping(false);
      const aiResponse = {
        id: Date.now() + 1,
        sender: 'synaptica',
        text: `Analyzed "${text}". Below is the synthesized solution combining analytical precision with practical context:`,
        aiReasoning: `Fast Logic Engine: Applied pattern match across 14,000 algorithmic benchmarks. Optimal path identified in 18ms.`,
        humanInsight: `Contextual Guardrail: Prioritized clean readability and maintainability so your production code stays easy to audit.`,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, aiResponse]);
    }, 1800);
  };

  return (
    <section id="preview" className="py-28 bg-void-950 relative overflow-hidden">
      {/* Radial Background Accent */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-synapse-500/10 rounded-full blur-[150px] pointer-events-none" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-mono uppercase tracking-widest text-ai-400 font-semibold">
            Interactive Showcase
          </span>
          <h2 className="text-3xl sm:text-5xl font-heading font-bold mt-3 tracking-tight">
            Experience the <span className="text-gradient-duality">Live Duality Interface</span>
          </h2>
          <p className="text-gray-400 text-base sm:text-lg mt-4">
            Test how Synaptica presents machine computational chains and human contextual insights side-by-side in real time.
          </p>
        </div>

        {/* Mock Chat Terminal Window */}
        <div className="glass-card rounded-3xl border border-void-700 shadow-2xl overflow-hidden backdrop-blur-2xl">
          
          {/* Terminal Window Header Bar */}
          <div className="bg-void-900 px-6 py-4 border-b border-void-700 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="flex gap-2">
                <span className="w-3 h-3 rounded-full bg-red-500/80 inline-block" />
                <span className="w-3 h-3 rounded-full bg-yellow-500/80 inline-block" />
                <span className="w-3 h-3 rounded-full bg-green-500/80 inline-block" />
              </div>
              <span className="text-xs font-mono font-semibold text-gray-300 ml-2">
                synaptica-core-v1.0.8 // duality-session
              </span>
            </div>

            {/* Active Engine Indicators */}
            <div className="flex items-center gap-4 text-xs font-mono">
              <div className="flex items-center gap-1.5 text-ai-400">
                <Cpu className="w-3.5 h-3.5 animate-pulse" />
                <span>AI-Engine: Active (0.8ms)</span>
              </div>
              <div className="flex items-center gap-1.5 text-human-400">
                <Brain className="w-3.5 h-3.5 animate-pulse" />
                <span>Human-Context: Synced</span>
              </div>
            </div>
          </div>

          {/* Screen Reader Live Region for Accessibility */}
          <div className="sr-only" aria-live="polite">
            {isTyping ? 'Synaptica is generating dual reasoning response' : ''}
          </div>

          {/* Messages Stream Container */}
          <div className="p-6 sm:p-8 min-h-[420px] max-h-[550px] overflow-y-auto space-y-6 bg-void-950/60">
            {messages.map((msg) => (
              <div key={msg.id} className="space-y-3">
                {msg.sender === 'user' ? (
                  /* User Message Bubble */
                  <div className="flex justify-end items-start gap-3">
                    <div className="bg-void-800 border border-void-700 rounded-2xl rounded-tr-none px-5 py-3.5 max-w-xl text-sm text-gray-200">
                      <p>{msg.text}</p>
                      <span className="text-[10px] font-mono text-gray-400 block text-right mt-1.5">{msg.time}</span>
                    </div>
                    <div className="w-9 h-9 rounded-full bg-human-500/20 border border-human-500/40 flex items-center justify-center shrink-0">
                      <User className="w-4 h-4 text-human-400" />
                    </div>
                  </div>
                ) : (
                  /* Synaptica AI Dual Response Bubble */
                  <div className="flex justify-start items-start gap-3">
                    <div className="w-9 h-9 rounded-full bg-synapse-500/20 border border-synapse-500/40 flex items-center justify-center shrink-0">
                      <Sparkles className="w-4 h-4 text-synapse-400" />
                    </div>

                    <div className="space-y-4 max-w-2xl w-full">
                      {/* Main Summary Text */}
                      <div className="bg-void-900 border border-void-700 rounded-2xl rounded-tl-none p-5 text-sm text-white">
                        <p className="leading-relaxed">{msg.text}</p>

                        {/* Split Stream Cards */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
                          {/* AI Logic Stream */}
                          <div className="p-3.5 rounded-xl bg-ai-500/10 border border-ai-500/30 text-xs">
                            <div className="flex items-center gap-1.5 text-ai-400 font-mono font-semibold mb-1.5">
                              <Cpu className="w-3.5 h-3.5" />
                              <span>AI Computational Logic</span>
                            </div>
                            <p className="text-gray-300 text-[13px] leading-snug">{msg.aiReasoning}</p>
                          </div>

                          {/* Human Context Stream */}
                          <div className="p-3.5 rounded-xl bg-human-500/10 border border-human-500/30 text-xs">
                            <div className="flex items-center gap-1.5 text-human-400 font-mono font-semibold mb-1.5">
                              <Brain className="w-3.5 h-3.5" />
                              <span>Human Intuition & Context</span>
                            </div>
                            <p className="text-gray-300 text-[13px] leading-snug">{msg.humanInsight}</p>
                          </div>
                        </div>

                        {/* Optional Code Snippet Display */}
                        {msg.codeSnippet && (
                          <div className="mt-4 rounded-xl bg-void-950 p-4 border border-void-700 font-mono text-xs text-ai-300 overflow-x-auto">
                            <pre><code>{msg.codeSnippet}</code></pre>
                          </div>
                        )}

                        <span className="text-[10px] font-mono text-gray-400 block mt-3">{msg.time} • Synaptic Fusion Verified</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}

            {/* Typing Indicator */}
            {isTyping && (
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-synapse-500/20 border border-synapse-500/40 flex items-center justify-center shrink-0">
                  <Sparkles className="w-4 h-4 text-synapse-400 animate-spin" />
                </div>
                <div className="bg-void-900 border border-void-700 px-5 py-3.5 rounded-2xl rounded-tl-none flex items-center gap-2">
                  <span className="text-xs font-mono text-gray-400">Synthesizing dual streams</span>
                  <div className="flex gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-ai-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-1.5 h-1.5 rounded-full bg-synapse-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-1.5 h-1.5 rounded-full bg-human-400 animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Preset Prompts Row */}
          <div className="px-6 py-3 bg-void-900/80 border-t border-void-800 flex flex-wrap items-center gap-2">
            <span className="text-xs font-mono text-gray-400 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-synapse-400" />
              Try prompt:
            </span>
            {samplePrompts.map((p, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(p)}
                className="text-xs font-medium text-gray-300 hover:text-white bg-void-800 hover:bg-void-700 border border-void-700 rounded-full px-3 py-1 transition-all cursor-pointer"
              >
                {p}
              </button>
            ))}
          </div>

          {/* Interactive Message Input Box */}
          <div className="p-4 sm:p-6 bg-void-900 border-t border-void-700 flex items-center gap-3">
            <input
              type="text"
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Ask Synaptica anything or describe your problem statement..."
              className="flex-1 bg-void-950 border border-void-700 rounded-2xl px-5 py-3.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-synapse-500 focus:ring-1 focus:ring-synapse-500 transition-all"
            />

            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => handleSend()}
              disabled={!inputVal.trim() || isTyping}
              className="btn-duality p-3.5 rounded-2xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center shrink-0 cursor-pointer"
            >
              <Send className="w-4 h-4 text-white" />
            </motion.button>

            <button
              onClick={onLaunchClick}
              className="hidden sm:flex items-center gap-2 px-4 py-3.5 rounded-2xl bg-void-800 hover:bg-void-700 border border-void-700 text-xs font-semibold text-gray-300 hover:text-white transition-colors cursor-pointer"
            >
              <span>Full App</span>
              <Sparkles className="w-3.5 h-3.5 text-ai-400" />
            </button>
          </div>

        </div>

      </div>
    </section>
  );
}
